<h1 align="center">Dhikr Time</h1>

<p align="center">
  <img alt="Github top language" src="https://img.shields.io/github/languages/top/shell-ninja/dhikr-time?color=56BEB8">
  <img alt="Github language count" src="https://img.shields.io/github/languages/count/shell-ninja/dhikr-time?color=56BEB8">
  <img alt="Repository size" src="https://img.shields.io/github/repo-size/shell-ninja/dhikr-time?color=56BEB8">
  <img alt="License" src="https://img.shields.io/github/license/shell-ninja/dhikr-time?color=56BEB8">
</p>

<p align="center">
  <a href="#dart-about">About</a> &#xa0; | &#xa0; 
  <a href="#sparkles-features">Features</a> &#xa0; | &#xa0;
  <a href="#white_check_mark-requirements">Requirements</a> &#xa0; | &#xa0;
  <a href="#checkered_flag-starting">Starting</a> &#xa0; | &#xa0;
  <a href="#memo-license">License</a> &#xa0;
</p>

<br>

## About ##

A project to find the prayer times (salat times) according to a specific location. 

## Features ##

- Search prayer times for different locations
- Read authentic Dua and Dhikr (under development)
- Read Asma Ul Husna (English / Bangla)

## Requirements ##

Before starting, you need to have [Git](https://git-scm.com) and [Node](https://nodejs.org/en/) installed. <br>
Also you need an API key from [IslamicAPi](https://islamicapi.com/). Create an account here and get the API key.

## Starting ##

```bash
# Clone this project
$ git clone --depth=1 https://github.com/shell-ninja/dhikr-time

# Access
$ cd dhikr-time

# Install dependencies
$ npm i

# Create a .env file at the root of the project and add:
VITE_SECRET_API_KEY="api_key_from_islamicAPI"

# Run the project
$ npm run dev

# The server will initialize in the http://localhost:5173/
```

## License ##

This project is under license from MIT. For more details, see the [LICENSE](LICENSE) file.


&#xa0;

<a href="#top">Back to top</a>
