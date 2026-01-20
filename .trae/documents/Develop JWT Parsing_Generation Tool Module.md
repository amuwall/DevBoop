# DevBoop JWT Tool Plugin Development Plan

## 1. Dependency Management
- **Action**: Install `jose` library.
- **Reason**: `jose` is a modern, lightweight, and dependency-free library for JWT/JWE/JWS handling that works seamlessly in both Node.js and Browser environments (Electron renderer). It supports all required algorithms (HS/RS series).

## 2. Directory Structure
Create a new plugin directory: `src/renderer/src/plugins/JwtTool/`
- `index.tsx`: Main UI component and plugin definition.
- `utils.ts`: Core JWT logic (generation, verification, decoding).
- `types.ts`: Type definitions for the module.
- `JwtTool.test.tsx`: Unit tests.

## 3. Core Logic Implementation (`utils.ts`)
Implement wrapper functions around `jose`:
- **Generation**: `generateToken(payload, key, options)`
  - Support algorithms: HS256/384/512, RS256/384/512.
  - Support standard claims: `exp`, `iat`.
  - Support custom headers.
- **Parsing/Verification**: `verifyToken(token, key)`
  - Verify signature.
  - Validate expiration.
  - Return decoded header and payload.
- **Decoding**: `decodeToken(token)` (safe decode without verification for UI display).
- **Security**: Ensure error messages are sanitized (e.g., "Invalid signature" instead of stack traces).

## 4. UI Implementation (`index.tsx`)
Use Fluent UI components to match DevBoop's design system.
- **Layout**: Two main tabs: "Generate" and "Parse/Verify".
- **Generate Tab**:
  - **Algorithm Select**: Dropdown for HS256, RS256, etc.
  - **Payload Input**: JSON editor (Textarea) with validation.
  - **Secret/Key Input**: Textarea for secret key or private key.
  - **Options**: Input fields for expiration (e.g., "1h", "2d").
  - **Output**: Read-only Textarea with copy button.
- **Parse/Verify Tab**:
  - **Token Input**: Textarea for pasting JWT.
  - **Secret/Key Input**: Textarea for public key/secret (optional for just decoding).
  - **Action Buttons**: "Decode Only" (show content), "Verify" (check signature).
  - **Results Display**:
    - Header (JSON view).
    - Payload (JSON view).
    - Status Indicator: Valid (Green) / Invalid (Red) / Expired (Yellow).

## 5. Integration
- **Register Plugin**: Import and register `JwtPlugin` in `src/renderer/src/App.tsx`.
- **Icon**: Use an appropriate icon from `@fluentui/react-icons` (e.g., `KeyRegular` or `CertificateRegular`).

## 6. Testing
- Create `JwtTool.test.tsx` using `vitest`.
- Cover:
  - Token generation with different algorithms.
  - Token verification (valid, invalid signature, expired).
  - Malformed token handling.
  - Payload parsing.

## 7. Deliverables
- Complete source code in `src/renderer/src/plugins/JwtTool`.
- Updated `package.json` and `App.tsx`.
- Unit tests ensuring >90% coverage.
