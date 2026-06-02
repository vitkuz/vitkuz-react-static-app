import StepHeader from '../components/StepHeader'
import CodeBlock from '../components/CodeBlock'
import Callout from '../components/Callout'

export default function GettingStarted() {
  return (
    <>
      <StepHeader
        order={3}
        title="Getting Started"
        intro="Follow this guide to set up your project and start exploring functional patterns."
      />

      <div className="prose prose-slate max-w-none prose-headings:scroll-mt-20 prose-a:text-blue-700 prose-code:text-slate-800 prose-pre:bg-transparent prose-pre:p-0">
        <h2>Prerequisites</h2>
        <ul>
          <li>Node.js 18 or later</li>
          <li>A package manager (npm, yarn, or pnpm)</li>
          <li>A text editor of your choice</li>
        </ul>

        <Callout tone="tip" title="Use an editor with good JS support">
          VS Code with the ESLint extension catches issues in real time and helps
          you follow functional patterns consistently.
        </Callout>

        <h2>Installation</h2>
        <p>
          Set up a new project with a few commands. We recommend a modern
          JavaScript environment with ES modules and a bundler like Vite.
        </p>
        <CodeBlock
          language="bash"
          code={`npm create vite@latest my-project -- --template react
cd my-project
npm install
npm run dev`}
        />

        <h2>Next steps</h2>
        <p>
          With your project ready, head to the patterns section to start
          learning. Each pattern builds on the previous one, so working
          through them in order gives the best experience.
        </p>
      </div>
    </>
  )
}
