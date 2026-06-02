export default function GettingStarted() {
  return (
    <article className="prose prose-gray mx-auto max-w-3xl">
      <h1 className="text-3xl font-semibold tracking-tight text-black">
        Getting Started
      </h1>
      <p className="mt-4 leading-relaxed text-gray-500">
        Follow this guide to set up your project and start building with Acme.
      </p>

      <h2 className="mt-10 text-xl font-medium text-black">
        Prerequisites
      </h2>
      <ul className="mt-3 space-y-2 text-gray-500">
        <li>Node.js 18 or later</li>
        <li>A package manager (npm, yarn, or pnpm)</li>
        <li>A text editor of your choice</li>
      </ul>

      <h2 className="mt-10 text-xl font-medium text-black">
        Installation
      </h2>
      <p className="mt-3 leading-relaxed text-gray-500">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi
        morbi tempus iaculis urna id volutpat lacus laoreet non. Curabitur
        gravida arcu ac tortor dignissim convallis aenean et tortor.
      </p>
      <pre className="mt-4 overflow-x-auto rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
        <code>{`npm create acme@latest my-project
cd my-project
npm run dev`}</code>
      </pre>

      <h2 className="mt-10 text-xl font-medium text-black">
        Next steps
      </h2>
      <p className="mt-3 leading-relaxed text-gray-500">
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
        dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
        proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
    </article>
  )
}
