<a name="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">

<h2 align="center">Youtube Randomiser</h2>

  <p align="center">
    A simple web app to mix Youtube playlists and videos and play them in randomised order.
    <br />
    <a href="https://youtube-randomiser.vercel.app/">View Demo</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About

This project is a website that lets users create mixes of Youtube playlists and videos, and then shuffle and play them. I made this as Youtube's native playlist shuffle feature often does not work properly and repeats videos.

### Built With

[![Svelte][Svelte.dev]][Svelte-url]
[![Sveltekit][kit.svelte.dev]][Sveltekit-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

Follow the below steps to run the web app locally.

### Prerequisites

-   npm
    ```sh
    npm install npm@latest -g
    ```

### Installation

1. Clone the repo
    ```sh
    git clone https://github.com/ImHamba/youtube-randomiser.git
    ```
2. Install NPM packages
    ```sh
    npm install
    ```
3. Build and run
    ```sh
    npm run build
    ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage

To use the website, you'll need the id's of some youtube video or playlists.

You can get the id of a youtube video by copying the part of the url after `v=`. For example `H1eEFfAkIik` is the video id from `https://www.youtube.com/watch?v=H1eEFfAkIik`.

You can get the id of a youtube playlist by copying the part of the url after `list=` when viewing a video from a playlist. For example `PL0vfts4VzfNjnYhJMfTulea5McZbQLM7G` is the playlist id from `https://www.youtube.com/watch?v=bJUl3OAIT0k&list=PL0vfts4VzfNjnYhJMfTulea5McZbQLM7G`.

Copy either a video or playlist id into the entry field under the "Mix Creator" title on the homepage of the website and click the + button to the left. This will add the video or playlist to your mix. You can give you mix a name and save it locally by clicking the bookmark icon at the bottom of the "Your Mix" panel, clear your mix by clicking the trash icon, or play the mix by presing the play icon. To access mixes across devices, you can create an account and sign in, and when saving mixes, they will be saved to your account. They will be visible in the "Saved Mixes" panel when logged in on any device.

You can load saved mixes by clicking the mix on the "Saved Mixes" panel. You can view the individual videos in a playlist by clicking on the dropdown arrow at the right of a playlist entry in the "Your Mix" panel.

Once you click the play icon, you'll be brought to the mix player page. This features standard music player controls at the top left, with a view of the randomised order of videos to be played below, and the Youtube player itself on the right. You can bring any video forward in the mix and skip to it by clicking on a video in the video view panel. The panel also features a search bar to find a particular video.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE` file for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Contact me here on Github

Project Link: [https://github.com/ImHamba/youtube-randomiser](https://github.com/ImHamba/youtube-randomiser)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

-   [Template for this readme](https://github.com/othneildrew/Best-README-Template)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->

[Svelte.dev]: https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00
[kit.svelte.dev]: https://img.shields.io/badge/SvelteKit-FF3E00?style=for-the-badge&logo=Svelte&logoColor=white
[Svelte-url]: https://svelte.dev/
[Sveltekit-url]: https://kit.svelte.dev/
