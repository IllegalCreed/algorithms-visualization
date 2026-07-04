import type { BentleyExecPoint, LangSource } from '@/components/player/types';

// Bentley-Ottmann：事件队列（起点/终点/交点按 x 序）驱动扫描线；
// 状态结构按 y 维护在场线段；相交前必相邻 → 只在插入/删除/交换时查新相邻对。
const ts = `function bentleyOttmann(segs: Seg[]): Pt[] {
  const events = new EventQueue(segs);     // 端点按 x 排序入队
  const status = new SweepStatus();        // 在场线段按 y 有序
  const out: Pt[] = [];
  while (!events.empty()) {
    const e = events.pop();                // 最左事件
    if (e.type === 'start') status.insert(e.seg);
    else if (e.type === 'end') status.remove(e.seg);
    else { out.push(e.pt); status.swap(e.s1, e.s2); } // 报告交点
    for (const [u, v] of status.newAdjacent())        // 只查新相邻对
      events.addCross(intersect(u, v));               // 未来交点入队
  }
  return out;
}`;

const python = `def bentley_ottmann(segs):
    events = EventQueue(segs)   # 端点按 x 排序入队
    status = SweepStatus()      # 在场线段按 y 有序
    out = []
    while events:
        e = events.pop()        # 最左事件
        if e.type == 'start':
            status.insert(e.seg)
        elif e.type == 'end':
            status.remove(e.seg)
        else:
            out.append(e.pt); status.swap(e.s1, e.s2)  # 报告交点
        for u, v in status.new_adjacent():  # 只查新相邻对
            events.add_cross(intersect(u, v))
    return out`;

const go = `func bentleyOttmann(segs []Seg) []Pt {
\tevents := NewEventQueue(segs) // 端点按 x 排序入队
\tstatus := NewSweepStatus()    // 在场线段按 y 有序
\tout := []Pt{}
\tfor !events.Empty() {
\t\te := events.Pop() // 最左事件
\t\tswitch e.Type {
\t\tcase Start:
\t\t\tstatus.Insert(e.Seg)
\t\tcase End:
\t\t\tstatus.Remove(e.Seg)
\t\tdefault: // 交点事件：报告并交换
\t\t\tout = append(out, e.Pt); status.Swap(e.S1, e.S2)
\t\t}
\t\tfor _, p := range status.NewAdjacent() { // 只查新相邻对
\t\t\tevents.AddCross(Intersect(p.U, p.V))
\t\t}
\t}
\treturn out
}`;

const rust = `fn bentley_ottmann(segs: &[Seg]) -> Vec<Pt> {
    let mut events = EventQueue::new(segs); // 端点按 x 排序入队
    let mut status = SweepStatus::new();    // 在场线段按 y 有序
    let mut out = vec![];
    while let Some(e) = events.pop() {      // 最左事件
        match e.kind {
            Kind::Start => status.insert(e.seg),
            Kind::End => status.remove(e.seg),
            Kind::Cross(p, a, b) => { out.push(p); status.swap(a, b) }
        }
        for (u, v) in status.new_adjacent() {  // 只查新相邻对
            events.add_cross(intersect(u, v)); // 未来交点入队
        }
    }
    out
}`;

export const bentleySources: LangSource<BentleyExecPoint>[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    // init=建队列 / start=插入 / end=删除 / cross=报告+交换 / done=返回
    lineMap: { init: 2, start: 7, end: 8, cross: 9, done: 13 },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    lineMap: { init: 2, start: 8, end: 10, cross: 12, done: 15 },
  },
  {
    lang: 'go',
    label: 'Go',
    code: go,
    lineMap: { init: 2, start: 9, end: 11, cross: 13, done: 19 },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    lineMap: { init: 2, start: 7, end: 8, cross: 9, done: 15 },
  },
];
