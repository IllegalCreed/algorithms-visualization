export interface Category {
  title: string,
  children: Item[]
}

export interface Item {
  title: string,
  url: string,
}