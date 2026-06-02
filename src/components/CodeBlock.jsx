import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'

// Minimal monochrome-friendly overrides: keep the light theme
// but tone down colours so the snippet stays readable without
// clashing with the black-and-white docs surface.
const style = {
  ...oneLight,
  'pre[class*="language-"]': {
    ...oneLight['pre[class*="language-"]'],
    background: '#f9fafb',
    borderRadius: '0.5rem',
    border: '1px solid #e5e7eb',
    fontSize: '0.875rem',
    lineHeight: '1.6',
  },
  'code[class*="language-"]': {
    ...oneLight['code[class*="language-"]'],
    background: 'transparent',
  },
}

export default function CodeBlock({ code, language = 'javascript' }) {
  return (
    <SyntaxHighlighter language={language} style={style} PreTag="div">
      {code.trimEnd()}
    </SyntaxHighlighter>
  )
}
