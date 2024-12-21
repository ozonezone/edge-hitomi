# edge-hitomi

### Introduction
This is a completely rewritten version of the 
[node-hitomi](https://github.com/H2Owater425/node-hitomi) project by 
[H2Owater425](https://github.com/H2Owater425) with the same functionality 
but only using the 
[Javascript Web API](https://developer.mozilla.org/en-US/docs/Web/API).

#### Documentations: [Github Pages](https://ztmayo.github.io/edge-hitomi/)

### Why is this necessary if the original project has no dependencies?
The original project uses a lot of Native Node.js modules which are not 
feasible in environments where Node.js is not available or not native (such 
as Vercel Edge Functions, Cloudflare Workers, etc.). This project aims to 
bring the same functionality to those environments.

### What is the difference between this and the original project?
This project is a complete rewrite of the original project. There have been 
several bug fixes and improvements. The original project lacked documentation 
so JSDocs were added to improve usability. There is better type safety and 
the use of ESLint means the code should have a more consistent style. There is a 
new helper fetch function called `edgeFetch` which is a wrapper around the
web API `fetch` that has all the necessary headers set to access or forward content 
from the website. 

### Where can I use this?
Currently, all the functionalities are tested and working on Vercel/Next.js 
edge runtime, and Cloudflare Workers. (CPU time and execution time haven't been fully tested.) As these are the two platforms I 
intended to use this project on, I have not tested it on other platforms. 
However, it should work on any platform that runs on a browser-based Javascript runtime like Chrome V8 Engine, Deno, Node. 

Note that this will not work natively with browsers as it modifies 
[Forbidden Header Names](https://developer.mozilla.org/en-US/docs/Glossary/Forbidden_header_name).
If your browser has extensions or workarounds to allow this, it might work.

**Please if 
you are using this on a different platform, make a pull request editing this 
README.md file.**

### How can I use this?
```bash
yarn add edge-hitomi
```
or (if you are using npm)
```bash
npm i edge-hitomi
```

### How do I work on this project?
You can clone this project and make your changes then\
build using (you can skip this step if you are not making any changes)
```bash
yarn build
```
or (if you are using npm)
```bash
npm run build
```

### Limitations
All the importable functions from the original project are implemented. 
However, due to the nature of Web APIs, SNI Spoofing found in the original 
project was removed. This is because the Web API does not allow modifying 
any part of the TLS handshake. If your country restricts access to the website 
(such as Korea), you will need to use a VPN or a proxy to have full 
functionalities. But it's meant to run on servers so it shouldn't be too much of a 
problem.

### What is the future of this project?
Currently, there needs to be some optimization to help run in edge computing 
environments as they tend to have minimal resources and timing. Right 
now, it is only ported to the Web API, but the optimizations are not done. 
If you would like to help with optimizing, please make a pull request with 
the changes. I will be happy to review them.

### Contributing
If you would like to contribute to this project, please make a pull request
with the changes. I will be happy to review them. If you have changed the
JSDocs, please run
```bash
yarn docs
```
or (if you are using npm)
```bash
npm run docs
```

### License
This project is licensed under the MIT License. Please see the
LICENSE file for more information.
