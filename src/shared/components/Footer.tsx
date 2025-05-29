export function Footer() {
  return (
    <footer className="bg-neutral-950">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <p className="text-center font-light font-serif text-3xl text-primary">Art Explorer</p>
        <p className="mt-6 text-center text-2xl text-white">React + The Met Museum API</p>
        <p className="text-center font-sans text-lg text-muted-foreground">
          Front-end challenge | See the code on{' '}
          <a
            className="text-muted-foreground transition-colors hover:text-muted"
            href="https://github.com/adeonir/art-explorer-react">
            Github
          </a>
        </p>
      </div>
    </footer>
  )
}
