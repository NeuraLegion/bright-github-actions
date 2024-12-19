# Stop a Bright Scan

This action stops a Bright scan.

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

**Required**. Your Bright API authorization token (key). You can generate it in the **Organization** section in [the Bright app](https://app.brightsec.com/login). Find more information [here](https://docs.brightsec.com/docs/manage-your-organization#manage-organization-apicli-authentication-tokens).

_Example:_ `api_token: ${{ secrets.BRIGHT_TOKEN }}`

### `scan`

**Required**. Scan ID to stop.

_Example:_ `scan: ${{ steps.start.outputs.id }}`

## Usage Example

### Stop a previously started scan

```yml
start_and_stop_scan:
  runs-on: ubuntu-latest
  name: A job to run a NeuraLegion scan
  steps:
    - name: 🏁 Start NeuraLegion Scan
      id: start
      uses: NeuraLegion/bright-github-actions/run-scan@master
      with:
        api_token: ${{ secrets.BRIGHT_TOKEN }}
        name: GitHub scan ${{ github.sha }}
        discovery_types: |
          [ "crawler", "archive" ]
        crawler_urls: |
          [ "https://juice-shop.herokuapp.com" ]
        file_id: LiYknMYSdbSZbqgMaC9Sj
        hosts_filter: |
          [ ]
        wait_for: on_high
    - name: Get the output scan url
      run: echo "The scan was started on ${{ steps.start.outputs.url }}"
    - name: ⏳ Wait for any issues
      id: wait
      uses: NeuraLegion/bright-github-actions/wait-for@master
      with:
        api_token: ${{ secrets.BRIGHT_TOKEN }}
        scan: ${{ steps.start.outputs.id }}
        wait_for: any
        timeout: 100
    - name: 🛑 Stop the scan
      if: ${{ always() }}
      id: stop
      uses: NeuraLegion/bright-github-actions/stop-scan@master
      with:
        api_token: ${{ secrets.BRIGHT_TOKEN }}
        scan: ${{ steps.start.outputs.id }}
```
