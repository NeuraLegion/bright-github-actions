# Poll status of a Bright Discovery

This action polls a Bright discovery until it finishes, or its time runs out.

### Build Secure Apps & APIs. Fast.

[Bright](https://www.brightsec.com) is a powerful dynamic application & API security testing (DAST) platform that security teams trust and developers love.

### Automatically Tests Every Aspect of Your Apps & APIs

Scans any target, whether Web Apps, APIs (REST. & SOAP, GraphQL & more), Web sockets or mobile, providing actionable reports

### Seamlessly integrates with the Tools and Workflows You Already Use

Bright works with your existing CI/CD pipelines – trigger scans on every commit, pull request or build with unit testing.

### Spin-Up, Configure and Control Scans with Code

One file. One command. One scan. No UI needed.

### Super-Fast Scans

Interacts with applications and APIs, instead of just crawling them and guessing.
Scans are fast as our AI-powered engine can understand application architecture and generate sophisticated and targeted attacks.

### No False Positives

Stop chasing ghosts and wasting time. Bright doesn’t return false positives, so you can focus on releasing code.

### Comprehensive Security Testing

Bright tests for all common vulnerabilities, such as SQL injection, CSRF, XSS, and XXE -- as well as uncommon vulnerabilities, such as business logic vulnerabilities.

More information is available on Bright’s:

- [Website](https://www.brightsec.com/)
- [Knowledge base](https://docs.brightsec.com/docs/quickstart)
- [YouTube channel](https://www.youtube.com/channel/UCoIC0T1pmozq3eKLsUR2uUw)
- [GitHub Actions](https://github.com/marketplace?query=neuralegion+)

# Inputs

### `api_token`

**Required**. Your Bright API authorization token (key). You can generate it in the **Organization** section in [the Bright app](https://app.neuralegion.com/login). Find more information [here](https://docs.brightsec.com/docs/manage-your-organization#manage-organization-apicli-authentication-tokens).

_Example:_ `api_token: ${{ secrets.BRIGHTSEC_TOKEN }}`

### `discovery_id`

**Required**. ID of an existing discovery to be polled.

_Example:_ `discovery_id: ${{ steps.start.outputs.id }}`

### `project_id`

**Required**. Provide project-id for the discovery.

_Example:_ `project_id: ${{ vars.PROJECT_ID }}`

### `timeout`

**Required**. Time for polling in seconds.

_Example:_ ` timeout: 55`

## Outputs

### `url`

URL of the resulting discovery.

## Usage Example

### Poll the results of a previously started discovery

```yml
start_and_wait_scan:
  runs-on: ubuntu-latest
  name: A job to run a Bright discovery
  steps:
    - name: Start Bright discovery 🏁
      id: start
      uses: NeuraLegion/bright-github-actions/run-discovery@release
      with:
        api_token: ${{ secrets.BRIGHTSEC_TOKEN }}
        name: GitHub discovery ${{ github.sha }}
        project_id: ${{ vars.PROJECT_ID }}
        discovery_types: |
          [ "crawler" ]
        crawler_urls: |
          [ "https://juice-shop.herokuapp.com" ]
        hosts_filter: |
          [ ]
    - name: Get the output discovery url
      run: echo "The discovery was started on ${{ steps.start.outputs.url }}"
    - name: Wait for discovery to finish ⏳
      id: wait
      uses: NeuraLegion/bright-github-actions/wait-for-discovery@release
      with:
        api_token: ${{ secrets.BRIGHTSEC_TOKEN }}
        discovery_id: ${{ steps.start.outputs.id }}
        project_id: ${{ vars.PROJECT_ID }}
        timeout: 55
```
