export default function Page() {
  return (
    <main className="mx-auto max-w-screen-md text-center">
      <img
        src="/me.jpg"
        alt="Dhaiwat Pandya"
        width="100px"
        className="avi mx-auto"
      />
      <h1 className="text-4xl font-bold">Dhaiwat Pandya</h1>
      <h3 className="text-xl">dhai.eth</h3>

      <a
        className="underline text-blue-700"
        href="https://github.com/dhaiwat10"
        target="_blank"
      >
        GitHub
      </a>
      <br />
      <a
        className="underline text-blue-700"
        href="https://hackmd.io/@dhaiwat10/ByA1tWTgee"
        target="_blank"
      >
        CV
      </a>
      <br />
      <a
        className="underline text-blue-700"
        href="https://twitter.com/dhaiwat10"
        target="_blank"
      >
        Twitter
      </a>
      <br />
      <a
        className="underline text-blue-700"
        href="https://mirror.xyz/dhaiwat.eth"
        target="_blank"
      >
        Mirror
      </a>
      <br />
      <a
        className="underline text-blue-700"
        href="https://dhaiwat.substack.com"
        target="_blank"
      >
        Substack
      </a>
    </main>
  );
}
