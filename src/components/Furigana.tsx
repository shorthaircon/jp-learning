interface Props {
  html: string
  className?: string
}

// 題幹和選項常含 <ruby><rt>...</rt></ruby> 與 <u>，這裡直接渲染 HTML。
// 是否顯示振假名由父層 className（furigana-on）控制。
export default function Furigana({ html, className }: Props) {
  return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />
}
