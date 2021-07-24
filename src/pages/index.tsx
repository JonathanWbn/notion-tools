import { FunctionComponent } from 'react'

const Home: FunctionComponent = () => {
  return (
    <div className="px-10 flex flex-col items-center">
      <h1 className="text-5xl mt-80 font-bold">Notion, but even more powerful.</h1>
      <h2 className="text-lg mt-4 text-gray-600">
        Solutions for your <i>{'"I wish I could automate that"'}</i> moments.
      </h2>
      <div className="w-full border-b border-opacity-80 mt-80" />
      <div className="max-w-2xl w-full">
        <h1 className="mt-5 text-2xl font-bold">
          🔁 Recurring tasks <span className="font-light">| beta | free</span>
        </h1>
        <div className="rounded-sm bg-gray-100 bg-opacity-80 mt-4 p-4">
          👉 This tool allows you to automatically create database pages on a schedule.
        </div>
        <p className="font-bold mt-4 mb-1">Examples:</p>
        <ul className="list-disc pl-6">
          <li className="mb-1">{'Create a new task "Clean the bathroom" every Sunday morning.'}</li>
          <li className="mb-1">
            {'Create a new event "Mum\'s birthday" for March 28th every year.'}
          </li>
          <li>{'Create an empty daily checklist page every night.'}</li>
        </ul>
        <a
          className="bg-green-200 py-1 px-8 mt-6 bg-lightGreen text-lg float-right border-green text-green hover:text-darkGreen"
          href="/api/auth/signup"
        >
          <span className="border-b border-darkGreen text-current font-medium">Try it out!</span>
        </a>
        <h1 className="text-2xl font-bold mt-36">🏗️ In development</h1>
        <div className="rounded-sm bg-gray-100 bg-opacity-80 mt-4 p-4">
          1️⃣ Create pre-filled database items via an embedded button.
        </div>
        <div className="rounded-sm bg-gray-100 bg-opacity-80 mt-4 p-4">
          📩 Emails summarising database activity (tasks done, journals written, books read).
        </div>
        <div className="rounded-sm bg-gray-100 bg-opacity-80 mt-4 p-4">
          📊 Charts to analyse your databases.
        </div>
      </div>
      <div className="w-full border-b border-opacity-80 mt-10" />
      <div className="py-5">
        <a
          className="border-b border-gray-500 opacity-60 hover:opacity-100"
          href="mailto:jwieben@hey.com?subject=Re: Notion tools&body=Hey Jonathan,"
          target="_blank"
          rel="noreferrer"
        >
          contact
        </a>
        {' / '}
        <a
          className="border-b border-gray-500 opacity-60 hover:opacity-100"
          href="https://jwieben.notion.site/Impressum-7be1b0e1a1384c1cb9362bd1aef963d1"
        >
          about
        </a>
      </div>
    </div>
  )
}

export default Home
