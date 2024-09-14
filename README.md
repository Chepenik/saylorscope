# SaylorScope: Advanced Financial Analysis Tool

SaylorScope is a web application for figuring out the first law of money. It is designed to help with financial analysis and wealth building, inspired by Michael Saylor\'s speech at the 2024 Bitcoin Conference in Nashville.

![First Law of Money](public/inspiration.jpg)

## Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/en/) installed on your machine. This project requires Node.js version 18.17.0 or higher.

### Installation

1. Clone the repository and install the dependencies:

```bash
git clone https://github.com/Chepenik/saylorscope.git
cd saylorscope
npm install 
Running the Development Server
To start the development server, run:

bash
Copy code
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
Open http://localhost:3000 with your browser to see the result.

if you run into problems when doing npm install I suggest running npm audit fix and updating running nvm install 20 (assuming you don't have node 20 installed) and then running nvm use 20
```

Editing the Project
You can start editing the page by modifying app/page.tsx. The page auto-updates as you edit the file. I personally code in Cursor pro and it makes it much easier to add changes. Do recommend :D

Features

Calculates the lifespan, ROI, and time it takes to double your money for various asset types.
Visual representation of the initial and projected values using Chart.js.
Supports physical, digital, and financial assets.
Tip button to support the project.
This app was designed for laptop/desktop view and allows more features on laptop/desktop however it can also work on mobile.

Deploy on Vercel

Feel free to fork and make your own version. The easiest way to deploy your own Next.js app is to use the Vercel Platform from the creators of Next.js: https://github.com/vercel/next.js/

Check out the Next.js deployment documentation for more details.

Future Work

Enhancements I'd like to build for SaylorScope:

Optimize for Mobile: Ensure the application is even more responsive and optimized for mobile devices.
Add a Database: Integrate a database to store user data, asset information, and analysis results.
User Authentication: Implement a login system for users to save and manage their assets and analysis over multiple sessions.
Improve UX: Continuously improve the user experience with a more intuitive interface and better feedback mechanisms.
Additional Financial Metrics: Add more advanced financial metrics and analysis tools to provide deeper insights. One obvious one I plan to work on is adding a slide so people can see more than just the 5 year projection of what an asset will be worth.
Export Options: Provide options to export analysis results in various formats (PDF, Excel, etc.).
Make a paid version with access to the internet that prepopulates the data and fetches it from yahoo finance, etc so a client does not have to fill in that data themselves.

License

This project is licensed under the MIT License - see the LICENSE file for details. Please feel free to make a pull request and contribute if you have ideas to improve SaylorScope

Acknowledgments

This project was inspired by Michael Saylor's presentation at the 2024 Bitcoin Conference in Nashville. I appreciate all the of Michael's insights.