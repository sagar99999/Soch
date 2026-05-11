# Security Specification: Soch Band Official

## Data Invariants
- Only the band administrator (`shaagar5@gmail.com`) can create, update, or delete tour dates, merchandise, and news.
- Any user (including unauthenticated) can view tour dates, merchandise, and news.
- Any user can send a fan message, but they cannot read or modify messages once sent.
- Fan messages must have valid fields and reasonable size limits.

## The "Dirty Dozen" Payloads (Deny List)
1. **Unauthorized Create Event**: Try to create an event as a non-admin user.
2. **Unauthorized Delete Event**: Try to delete an event as an unauthenticated user.
3. **Invalid Event ID**: Injecting a 2KB string as an event ID.
4. **Spoofed Author**: Try to post news as "Admin" without being the admin.
5. **PII Leakage**: Try to list all fan messages as a random user.
6. **Negative Price**: Create a merch item with price `-100`.
7. **Phantom Field**: Create an event with an extra `isVerified: true` field to bypass some hypothetical check.
8. **Invalid Status**: Set event status to `internal_only`.
9. **Update Immutable**: Try to change `createdAt` on an existing event.
10. **Huge Fan Message**: Send a 1MB message in the contact form.
11. **Email Spoofing**: Log in as someone else via a custom token (though rules should handle auth object).
12. **Orphaned Event**: Create an event without a date.

## Test Runner (Conceptual)
All the above should return `PERMISSION_DENIED`.
