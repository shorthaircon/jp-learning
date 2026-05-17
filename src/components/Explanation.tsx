import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'

interface Props {
  text: string
}

// 解析的 markdown 內可能含 ruby HTML，需要 rehype-raw 才會渲染。
export default function Explanation({ text }: Props) {
  return (
    <div className="prose-jp text-[15px]">
      <ReactMarkdown rehypePlugins={[rehypeRaw]}>{text}</ReactMarkdown>
    </div>
  )
}
