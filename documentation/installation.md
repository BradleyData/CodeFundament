# Installation
## Prerequisites
### Git
- Make sure that [git](https://git-scm.com/) is installed. Whether you are using a service like GitHub or a private git repository, you should be using a version controlled source code management system.
### Docker
- Install [Docker](https://docs.docker.com/get-docker/).
- **Linux:** Also install [Docker Compose](https://docs.docker.com/compose/install/).
- **Windows:** Also install [WSL2](https://docs.microsoft.com/en-us/windows/wsl/install-win10)
### DNS Proxy
- This foundation will make all containers available on the domain "local.test". To simplify development, you should configure a DNS proxy to redirect all requests for "local.test" to 127.0.0.1 (your computer). This should not cause conflicts because the [test TLD is reserved](https://en.wikipedia.org/wiki/.test) for these purposes. If you already have a DNS proxy on your intranet, you can adjust its configuration and not install one on your computer.
- **Any system:** [Pi-hole](https://pi-hole.net/) can be installed on a Raspberry Pi on your network or in a Docker container on your computer. In addition to working as DNS proxy, it will block internet ads for you.
- **Linux:** [Dnsmasq](http://www.thekelleys.org.uk/dnsmasq/doc.html)
- **Mac:** TBD
- **Windows:** [Acrylic](https://mayakron.altervista.org/support/acrylic/Home.htm)
### Visual Studio Code
- [VSCode](https://code.visualstudio.com/Download) is optional, but highly recommended. The goal is to make this foundation function just fine with any toolchain, but there are environment settings and helper scripts defined to make things simpler in VSCode.
- Make sure the following extensions are installed:
  - Docker by Microsoft
  - GitHub Pull Requests and Issues by GitHub (Optional. If you aren't using GitHub then you won't need this.)
  - Remote - Containers by Microsoft
  - **Windows:** Run on Save by emeraldwalk (Optional. Solves a problem with watch processes not receiving file timestamps.)
### GPG
- **Linux and Mac:** Install gpg for the commandline.
- **Windows:** Install a gpg certificate manager such as [Kleopatra](https://www.openpgp.org/software/kleopatra/).
## Initial Setup
### Prepare the repository (once per project)
- Create a new, empty repository.
- Copy the files from this repository into it.
  - You can exclude the documentation.
  - Feel free to change LICENSE and README.md to fit your own project.
  - Make any other configuration changes you want. The goal is to get you started quickly, not chain you to the provided code. Use as much or as little as you like.
### Prepare your local copy (once per computer per project)
- Copy .env.template to .env and make any changes needed.
- Copy any secrets/*.template files and make any changes needed.
- Configure git with your username and email.
  - git config user.name "Your Name"
  - git config user.email "your@email.com" If you are using GitHub and have your email address set to be private, then you **must** use the email address they provide "SomethingRandom@users.noreply.github.com".
- **Windows:** If you will be working with others using Linux or Mac, be sure to turn off automatic line endings in git. (git config core.autocrlf false)
- Configure commit signing: [Git](https://git-scm.com/book/en/v2/Git-Tools-Signing-Your-Work) / [GitHub](https://docs.github.com/en/github/authenticating-to-github/signing-commits)
  - Again, if you are on GitHub with a private email addres, you **must** use the one provided instead of your actual when creating the GPG key.
  - **Windows:** git config gpg.program "the full path to your gpg.exe file"
  - git config commit.gpgsign true
  - git config user.signingkey YourSigningKeyGoesHere
- Configure VSCode
  - If you are using GitHub, sign in by clicking on the icon for the Pull Request extension in the left side-bar and following the instructions. If anything goes wrong with the sign-in, you can sign out again by clicking on the icon of a person just above the gear on the bottom left of the screen.
## First Run
If you are not using VSCode, you can refer to **.vscode/tasks.json** to see the Docker commands used by the various scripts.
- Click on **Terminal** and then **Run task...**
- You should see a list of pre-programmed scripts available.
- Select **Start all containers** to bring up the development stack.
- The postgres container will automatically shutdown if it doesn't find its data. Run **Initialize postgres database** to resolve this and rerun **Start all containers**.
- Go to the Remote Explorer in the left side-bar and click on the icon for **Attach to Container** next to the API container. A new VSCode window will open and the Explorer will have a button **Open Folder**. The default path should be "/home/node". On subsequent runs, attaching to the container should automatically open this folder.
    - **Windows:** If you are using the Run on Save extension then you will need to install it in the container.
