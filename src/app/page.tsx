import { Button } from '../components/button'
import { Toggle } from '../components/toggle'
import permissionsScreenshot from './notion-permissions.png'
import Image from 'next/image'
import { FunctionComponent } from 'react'

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
          <h3 className="mt-5 text-2xl font-bold">🔁 Recurring tasks</h3>
          <p className="rounded-sm bg-amber-100 bg-opacity-80 mt-4 p-4">
            <span className="mr-2">👌</span>This use case has now been solved by Notion&lsquo;s{' '}
            <a
              href="https://www.notion.so/help/guides/automate-work-repeating-database-templates"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 underline transition-colors hover:text-gray-600"
            >
              repeating database templates
            </a>
            .
          </p>
          <p className="rounded-sm bg-gray-100 bg-opacity-80 mt-4 p-4">
            <span className="mr-2">👉</span>This tool allows you to automatically create database
            pages on a schedule.
          </p>
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
        <div className="w-full max-w-lg ml-10 my-4 shadow rounded-lg overflow-hidden">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/FwX161oSmO0?rel=0&showinfo=0&modestbranding=0"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Demo"
          />
        </div>
      </div>
      <div className="w-full border-b border-opacity-80" />
      <div className="w-full max-w-screen-xl flex justify-between py-14">
        <div className="w-full max-w-lg mr-10 my-4 shadow rounded-lg overflow-hidden">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/9golvinps88?rel=0&showinfo=0&modestbranding=0"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Demo"
          />
        </div>
        <div className="max-w-2xl w-full flex flex-col">
          <h3 className="mt-5 text-2xl font-bold">📊 Database visualization</h3>
          <p className="rounded-sm bg-gray-100 bg-opacity-80 mt-4 p-4">
            <span className="mr-2">👉</span>This tool allows you to visualization the data in your
            databases.
          </p>
          <p className="font-bold mt-4 mb-1">Examples:</p>
          <ul className="list-disc pl-6">
            <li className="mb-1">{'See a graph of your weight over the past 6 months.'}</li>
            <li className="mb-7">{'Compare your productivity with your sleep.'}</li>
          </ul>
          <Button className="self-end mt-10" color="green" href="/api/auth/signup">
            Try it out!
          </Button>
        </div>
      </div>
      <div className="w-full border-b border-opacity-80 my-5" />
      <div className="max-w-2xl w-full flex flex-col">
        <h3 className="text-2xl font-bold mb-3">❓ FAQ</h3>
        <Toggle label="Is this free?">
          <p>Yes.</p>
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
            Products like{' '}
            <a href="https://zapier.com/" target="_blank" rel="noreferrer" className="underline">
              Zapier
            </a>{' '}
            are great at connecting services with each other (e.g. Notion with Slack). But when it
            comes to automating advanced workflows <strong>within</strong> Notion it becomes less
            powerful and more complex.
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
            connecting notion-tools.io to your Notion account, you will be asked to select the
            pages/databases you want to give access to. You can also later re-configure these
            permissions either within Notion or within the settings of this app. I encourage you to
            only select the pages you are actually going to use. Notion also has a{' '}
            <a
              href="https://www.notion.so/guides/understanding-notions-sharing-settings"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              guide
            </a>{' '}
            to further explain how permissions work.
          </p>
          <Image
            className="w-80 shadow rounded-lg mx-auto"
            src={permissionsScreenshot}
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
          href="https://jwieben.notion.site/Privacy-Policy-for-Notion-Tools-ac15ce17678a478aaa7fd062da638dcc"
        >
          privacy
        </a>
        {' / '}
        <a
          className="border-b border-gray-500 opacity-60 hover:opacity-100"
          href="https://www.termsfeed.com/live/249035dc-8d27-4c14-ad35-a68cfdc94feb"
        >
          terms and conditions
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
