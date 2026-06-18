#!/bin/bash
# ============================================================
# algorithms-visualization 自有服务器部署脚本
# 用法: ./scripts/deploy.sh
# 目标: https://algo.illegalscreed.cn （服务器 47.120.26.143）
#
# 策略：本地以 selfhost 模式构建（base=/）→ tar 打包 → scp →
#       远程解压到 dist.new → 原子切换（mv）。旧版本保留为 dist.old。
# 注：GitHub Pages 用 `pnpm build`（base=/algorithms-visualization/），与此互不影响。
# ============================================================
set -e

SERVER_HOST="47.120.26.143"
SERVER_USER="root"
REMOTE_DIR="/var/www/algorithms"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_ROOT"

echo "[1/4] 检查 SSH 连接..."
ssh -o ConnectTimeout=5 -o BatchMode=yes "${SERVER_USER}@${SERVER_HOST}" 'echo ok' >/dev/null || {
  echo "无法连接服务器，请确认 SSH key 已配置"; exit 1;
}

echo "[2/4] 构建（selfhost 模式，base=/）..."
pnpm type-check
pnpm exec vite build --mode selfhost

LOCAL_DIST="$PROJECT_ROOT/dist"
[ -f "$LOCAL_DIST/index.html" ] || { echo "dist 未构建（缺 index.html）"; exit 1; }

echo "[3/4] 打包并上传..."
tar czf /tmp/algo-dist.tgz --exclude='.DS_Store' -C "$LOCAL_DIST" .
scp -q /tmp/algo-dist.tgz "${SERVER_USER}@${SERVER_HOST}:/tmp/"

echo "[4/4] 远程原子切换..."
ssh "${SERVER_USER}@${SERVER_HOST}" "RD='${REMOTE_DIR}' bash -s" <<'REMOTE'
set -e
mkdir -p "$RD"
cd "$RD"
rm -rf dist.new && mkdir dist.new
tar xzf /tmp/algo-dist.tgz -C dist.new
[ -f dist.new/index.html ] || { echo "解压异常：缺 index.html，中止"; rm -rf dist.new; exit 1; }
rm -rf dist.old
[ -d dist ] && mv dist dist.old || true
mv dist.new dist
rm -f /tmp/algo-dist.tgz
REMOTE
rm -f /tmp/algo-dist.tgz
echo "✓ 部署完成：https://algo.illegalscreed.cn （旧版本备份在远程 ${REMOTE_DIR}/dist.old）"
