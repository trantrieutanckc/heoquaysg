interface Block {
  type: string
  data: Record<string, any>
}

interface EditorContent {
  blocks?: Block[]
}

function renderBlock(block: Block, index: number) {
  switch (block.type) {
    case "header": {
      const level = block.data.level ?? 2
      const Tag = `h${level}` as keyof JSX.IntrinsicElements
      return (
        <Tag key={index} dangerouslySetInnerHTML={{ __html: block.data.text }} />
      )
    }

    case "paragraph":
      return (
        <p key={index} dangerouslySetInnerHTML={{ __html: block.data.text }} />
      )

    case "list": {
      const items: string[] = block.data.items ?? []
      if (block.data.style === "ordered") {
        return (
          <ol key={index}>
            {items.map((item, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ol>
        )
      }
      return (
        <ul key={index}>
          {items.map((item, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </ul>
      )
    }

    case "code":
      return (
        <pre key={index}>
          <code>{block.data.code}</code>
        </pre>
      )

    case "image":
      return (
        <figure key={index}>
          <img
            src={block.data.file?.url ?? block.data.url}
            alt={block.data.caption ?? ""}
            className="rounded-md w-full object-cover"
          />
          {block.data.caption && (
            <figcaption>{block.data.caption}</figcaption>
          )}
        </figure>
      )

    case "quote":
      return (
        <blockquote key={index}>
          <p dangerouslySetInnerHTML={{ __html: block.data.text }} />
          {block.data.caption && (
            <cite>— {block.data.caption}</cite>
          )}
        </blockquote>
      )

    case "delimiter":
      return <hr key={index} />

    case "table": {
      const rows: string[][] = block.data.content ?? []
      const hasHeader = block.data.withHeadings && rows.length > 0
      return (
        <div key={index} className="overflow-x-auto">
          <table>
            {hasHeader && (
              <thead>
                <tr>
                  {rows[0].map((cell, ci) => (
                    <th key={ci} dangerouslySetInnerHTML={{ __html: cell }} />
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {(hasHeader ? rows.slice(1) : rows).map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td key={ci} dangerouslySetInnerHTML={{ __html: cell }} />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    }

    case "embed":
      return (
        <div key={index} className="aspect-video not-prose">
          <iframe
            src={block.data.embed}
            title={block.data.caption ?? "embed"}
            className="h-full w-full rounded-md border"
            allowFullScreen
          />
        </div>
      )

    default:
      return null
  }
}

export function EditorJsRenderer({ content }: { content: unknown }) {
  if (!content) return null

  let parsed: EditorContent = {}
  if (typeof content === "string") {
    try { parsed = JSON.parse(content) } catch { return null }
  } else {
    parsed = content as EditorContent
  }

  const blocks = parsed.blocks ?? []
  if (!blocks.length) return null

  return (
    <div className="prose prose-stone dark:prose-invert max-w-none break-words">
      {blocks.map((block, i) => renderBlock(block, i))}
    </div>
  )
}
