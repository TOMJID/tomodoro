# Installation

## Prerequisites

```sh
node
pnpm
```

## Build the package

Clone the repository and navigate to the project directory:

```sh
git clone https://github.com/Projects/tomodoro.git
cd tomodoro
```

Install dependencies:

```sh
pnpm install
```

Compile the TypeScript source and copy the sound assets:

```sh
pnpm run build
```

Create the npm package:

```sh
pnpm pack
```

```sh
npm add --global ./tomodoro-1.0.0.tgz
```

## Usage

Start the timer with the default settings:

```sh
tomodoro start
```

Start it with custom durations:

```sh
tomodoro start --work 25 --short-break 5 --long-break 15 --session 4
```

For more information:

```sh
tomodoro start --help
```
