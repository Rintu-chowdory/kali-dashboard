import { CopyButton } from "./ui.jsx";

function Snippet({ title, code, btnLabel }) {
  return (
    <div className="snippet-card">
      <div className="snippet-head">
        <span>{title}</span>
        <CopyButton text={code} label={btnLabel || "copy"} />
      </div>
      <div className="snippet-code">{code}</div>
    </div>
  );
}

const PULL = "docker pull riinnttuu/dev-env:latest";
const RUN = `# interactive session, mount current dir
docker run -it --rm \\
  -v $(pwd):/home/kalidev/workspace \\
  riinnttuu/dev-env:latest`;
const COMPOSE = `# docker-compose.yml
services:
  dev:
    image: riinnttuu/dev-env:latest
    container_name: kali-dev
    stdin_open: true
    tty: true
    working_dir: /home/kalidev/workspace
    volumes:
      - ./:/home/kalidev/workspace`;
const DEVCONTAINER = `// .devcontainer/devcontainer.json
{
  "image": "riinnttuu/dev-env:latest",
  "customizations": {
    "vscode": {
      "extensions": [
        "dbaeumer.vscode-eslint",
        "ms-python.python",
        "esbenp.prettier-vscode"
      ]
    }
  },
  "workspaceFolder": "/home/kalidev/workspace",
  "workspaceMount": "source=\${localWorkspaceFolder},target=/home/kalidev/workspace,type=bind"
}`;
const ALIASES = `# handy extras for your ~/.bashrc
alias dc="docker compose"
alias dx="docker exec -it kali-dev bash"
alias ll="ls -lah --color=auto"
alias gs="git status"
alias serve="python3 -m http.server 8000"`;

export default function SnippetsTab() {
  return (
    <div className="fade-in">
      <div className="grid stat-grid-3">
        <Snippet title="docker pull" code={PULL} btnLabel="copy pull" />
        <Snippet title="docker run" code={RUN} btnLabel="copy run" />
        <Snippet title="docker-compose" code={COMPOSE} btnLabel="copy yml" />
        <Snippet title="devcontainer (VS Code)" code={DEVCONTAINER} btnLabel="copy json" />
        <Snippet title="bash aliases" code={ALIASES} btnLabel="copy rc" />
        <div className="panel" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div className="panel-title" style={{ marginBottom: 0 }}>Workflow</div>
          <div style={{ fontSize: 11.5, color: "var(--muted)", lineHeight: 1.8 }}>
            <div>1 · pull or build the image</div>
            <div>2 · run it with your workspace mounted</div>
            <div>3 · attach VS Code via the devcontainer</div>
            <div>4 · push to <span style={{ color: "var(--green)" }}>main</span> → CI builds & publishes everything</div>
          </div>
          <div className="total-row" style={{ marginTop: "auto", marginBottom: 0 }}>
            <span style={{ color: "var(--muted)" }}>REPO</span>
            <span style={{ color: "var(--cyan)" }}>Rintu-chowdory/kali-dashboard</span>
          </div>
        </div>
      </div>
    </div>
  );
}
