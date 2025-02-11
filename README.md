# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

The Gaming Lab
The Gaming Lab is an interactive website for gaming enthusiasts to explore and rate their favorite video games, as well as connect with other gamers. The website provides users with a seamless experience of searching for games, filtering results based on various criteria, and sharing opinions through posts and comments.

Features
1. Game Discovery
Browse a wide selection of games.
Use the search bar to find specific games by name.
Filter games based on genre, themes, platforms, ESRB rating, and game modes (e.g., Single-player, Multiplayer).
Games are displayed with their ratings, release date, cover image, and a brief summary.
2. User Authentication
Sign up with a username, email, and password.
Log in to access personalized features such as saving favorite games, posts, and connecting with friends.
Secure user registration and authentication using JWT tokens for user sessions.
3. User Profiles
Customize your profile with a profile picture and background image.
Show your favorite games and game genres.
Edit your username and other profile details.
View and interact with your friends' profiles and posts.
4. Posts and Comments
Users can create posts about games they enjoy or wish to discuss.
Comment on other users' posts to start conversations.
Post visibility is controlled by hashtags, allowing users to connect their posts to specific games or genres.
5. Game Details Page
View detailed information about each game, including:
Game name, cover image, and rating.
Platforms available, first release date, and ESRB rating.
A summary of the game and its themes.
Users can also leave comments and join discussions related to the game.
6. Friend System
Send and accept friend requests.
View your friends' posts and activities.
Interact with friends through messages and profile views.
7. Responsive Design
The website is designed to be fully responsive, meaning it looks great on all devices, from desktops to mobile phones.
Tech Stack
Frontend
React.js: For building the user interface with a component-based architecture.
React Router: For navigation and routing within the website.
CSS: For styling the user interface, with a mobile-first approach.
Backend
Node.js: As the runtime environment for the backend server.
Express.js: A minimal and flexible Node.js web application framework for handling API routes and middleware.
PostgreSQL: A relational database used for storing user and game data.
JWT Authentication: For securing user sessions and providing a smooth authentication flow.
APIs
Twitch API: For extending functionality related to Twitch game streams.