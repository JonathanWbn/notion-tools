import { FunctionComponent } from 'react'
import { Button } from '../infrastructure/components/button'
import { Toggle } from '../infrastructure/components/toggle'

const Home: FunctionComponent = () => {
  return (
    <div className="px-10 flex flex-col items-center">
      <h1 className="text-5xl mt-80 font-bold">Notion, but even more powerful.</h1>
      <h2 className="text-lg mt-4 text-gray-600">
        Solutions for your <i>{'"I wish I could automate that!"'}</i> moments.
      </h2>
      <div className="w-full border-b border-opacity-80 mt-80" />
      <div className="w-full max-w-screen-xl flex justify-between py-14">
        <div className="max-w-2xl w-full flex flex-col">
          <h1 className="mt-5 text-2xl font-bold">
            🔁 Recurring tasks <span className="font-light">| beta</span>
          </h1>
          <div className="rounded-sm bg-gray-100 bg-opacity-80 mt-4 p-4">
            <span className="mr-2">👉</span>This tool allows you to automatically create database
            pages on a schedule.
          </div>
          <p className="font-bold mt-4 mb-1">Examples:</p>
          <ul className="list-disc pl-6">
            <li className="mb-1">
              {'Create a new task "Clean the bathroom" every Sunday morning.'}
            </li>
            <li className="mb-1">
              {'Create a new event "Mum\'s birthday" for March 28th every year.'}
            </li>
            <li>{'Create an empty daily checklist page every night.'}</li>
          </ul>
          <Button className="self-end mt-10" color="green" href="/api/auth/signup">
            Try it out!
          </Button>
        </div>
        <img
          className="w-full max-w-lg ml-10 shadow rounded-lg"
          src="/recurring-tasks-demo.png"
          alt="Recurring Tasks Demo"
        />
      </div>
      <div className="w-full border-b border-opacity-80 my-5" />
      <div className="max-w-2xl w-full flex flex-col">
        <h1 className="text-2xl font-bold mb-3">❓ FAQ</h1>
        <Toggle label='Is "Recurring tasks" the only tool?'>
          <p className="mb-2">
            As of now, yes. But new tools are already being developed. Here are some of the tools
            under development:
          </p>
          <p>
            1️⃣ Create pre-filled database items via an embedded button.
            <br />
            📩 Emails summarising database activity (tasks done, journals written, books read).
            <br />
            📊 Charts to analyse your databases.
          </p>
        </Toggle>
        <Toggle label="Is this free?">
          <p>Yes, it is. But I am planning to add a monthly fee at some point in the future.</p>
        </Toggle>
        <Toggle label="Is this product affiliated with Notion Labs, Inc.?">
          <p>
            No, it is not. This is an independent product that uses the{' '}
            <a
              href="https://developers.notion.com/"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              official Notion API
            </a>{' '}
            to to make the Notion product more powerful.
          </p>
        </Toggle>
        <Toggle label="What makes notion-tools.io different from existing automation tools like Zapier?">
          <p className="mb-2">
            Products like Zapier are great at connecting services with each other (e.g. Notion with
            Slack). But when it comes to automating advanced workflows <strong>within</strong>{' '}
            Notion it becomes less powerful and more complex.
          </p>
          <p className="mb-2">
            notion-tools.io is going to focus on{' '}
            <strong>making the most out of your databases</strong>. It will be a collection of tools
            that each solve a specific use case in a way that is easy to configure.
          </p>
          <p>
            {
              "I started building this tool after I found that existing automation tools (and I tried them all) didn't work well for the problems I wanted to solve."
            }
          </p>
        </Toggle>
        <Toggle label="How can I trust that you are not going to misuse my data?">
          <p className="mb-2">
            Notion tools does not collect any user data (except an email for signup/login). When
            connecting notion-tools.io to your Notion account, you are going to be asked to select
            the pages/databases you want to give access to. You can also later re-configure these
            permissions either within Notion or within the settings of this app. I encourage you to
            only select the pages you are actually going to use.
          </p>
          <img
            className="w-80 shadow rounded-lg mx-auto"
            src="/notion-permissions.png"
            alt="Notion permissions"
          />
        </Toggle>
      </div>
      <div className="w-full border-b border-opacity-80 mt-10" />
      <div className="py-5">
        <a
          className="border-b border-gray-500 opacity-60 hover:opacity-100"
          href="https://jwieben.notion.site/Impressum-7be1b0e1a1384c1cb9362bd1aef963d1"
        >
          imprint
        </a>
        {' / '}
        <a
          className="border-b border-gray-500 opacity-60 hover:opacity-100"
          href="https://www.notion.so/jwieben/Privacy-Policy-for-Notion-Tools-ac15ce17678a478aaa7fd062da638dcc"
        >
          privacy
        </a>
        {' / '}
        <a
          className="border-b border-gray-500 opacity-60 hover:opacity-100"
          href="https://jonathanwieben.com"
          target="_blank"
          rel="noreferrer"
        >
          made by Jonathan Wieben
        </a>
        {' / '}
        <a
          className="border-b border-gray-500 opacity-60 hover:opacity-100"
          href="mailto:jwieben@hey.com?subject=Re: Notion tools&body=Hey Jonathan,"
          target="_blank"
          rel="noreferrer"
        >
          email me
        </a>
      </div>
    </div>
  )
}

export default Home
