```mermaid
sequenceDiagram
    participant browser
    participant server

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    Note right of browser: Form Data: {content: "test4", date: "2023-05-15T19:15:40.035Z"}
    activate server
        server-->>browser: server-->>browser: {"message":"note created"}
    deactivate server

    Note right of browser: Unlike the non-SPA version, it does not cause a page redirect.

```