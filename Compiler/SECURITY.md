# Compiler service deployment

The compiler accepts `/run` and `/submit` only with the `x-compiler-secret` header. Set the same randomly generated `COMPILER_API_SECRET` in the Backend and Compiler environment. The example files show the required variable; never use the placeholder value.

For Docker deployments, use `compose.yaml` and keep port 5000 private. Put the Backend container on the same private Docker network and set `COMPILER_URL` to `http://compiler:5000`. Do not publish port 5000 to the public internet.

On Linux, each job runs under its own temporary UID and GID. The runner strips application secrets from the job environment and applies CPU, virtual memory, file size, process count, wall-clock, and output limits. The Compose configuration also makes the container filesystem read-only outside temporary job directories and caps container resources.

The compiler still needs outbound database access because it reads test cases and saves submissions. User programs share that container network namespace. Keep the container on a private network and apply an egress policy at the deployment host if user programs must not make outbound network connections.
