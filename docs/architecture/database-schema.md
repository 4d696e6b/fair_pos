# Database schema

FAIR POS uses **Cloud Firestore** plus **Firebase Storage** for images. Collection names live in `src/lib/collections.ts`.

Public catalog (fairs, shops, menu) is readable without signing in. Writes require a signed-in user. Deploy `firestore.rules` and `storage.rules` in the Firebase console.

## Collections

### `users/{uid}`

App profile. Document id is the Firebase Auth UID.

| Field | Type |
| --- | --- |
| username | string |
| email | string |
| isVerified | boolean |
| firstName | string (optional) |
| lastName | string (optional) |
| phone | string (optional) |
| notifyEmail | boolean (optional) |
| notifySalesSummary | boolean (optional) |
| createdAt / updatedAt | timestamp |

### `fairs/{fairId}`

| Field | Type |
| --- | --- |
| name, dateRange, location, image | string |
| badge | string (optional) |
| category | `ตลาดนัด` \| `ของกิน` \| `ของใช้` |
| createdAt / updatedAt | timestamp |

### `shops/{shopId}`

| Field | Type |
| --- | --- |
| fairId | string |
| ownerUserId | string (optional) |
| name, category, image, icon, boothNumber | string |
| description, location | string (optional) |
| taxRate, serviceCharge | number (optional) |
| sellingStyle | `takeaway` \| `dine-in` \| `both` (optional) |
| createdAt / updatedAt | timestamp |

### `menuItems/{itemId}`

| Field | Type |
| --- | --- |
| shopId, name, image, category | string |
| price | number |
| description | string (optional) |
| isAvailable | boolean |
| createdAt / updatedAt | timestamp |

### `orders/{orderId}`

| Field | Type |
| --- | --- |
| fairId, shopId, queueNumber, refCode | string |
| userId, tableLabel | string (optional) |
| type | `dine-in` \| `takeaway` |
| lines | array of `{ item, qty, note? }` |
| subtotal, tax, total | number |
| status | `received` \| `preparing` \| `ready` \| `completed` \| `cancelled` |
| estimatedMinutes | string |
| createdAt / updatedAt | timestamp |

### `tables/{tableId}`

| Field | Type |
| --- | --- |
| shopId, label | string |
| status | `empty` \| `occupied` \| `awaiting-payment` |
| total, seatedMinutes | number (optional) |
| createdAt / updatedAt | timestamp |

### `staff/{staffId}`

| Field | Type |
| --- | --- |
| shopId, name, employeeId, role | string |
| status | `active` \| `inactive` |
| createdAt / updatedAt | timestamp |

### `shopCosts/{shopId}`

Fixed monthly costs used by finance. Document id matches the shop.

| Field | Type |
| --- | --- |
| boothRent, wages, ingredients, misc | number |
| updatedAt | timestamp |

## Storage

Cover photos: `stores/{shopId}/cover-{timestamp}-{filename}`
