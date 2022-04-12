export const productSchemaObject = {
  "database": "product-db",
  "version": 1,
  "encrypted": false,
  "mode": "full",
  "tables": [
    {
      "name": "vendors",
      "schema": [
        { "column": "id", "value": "INTEGER PRIMARY KEY NOT NULL" },
        { "column": "company_name", "value": "TEXT NOT NULL" },
        { "column": "company_info", "value": "TEXT NOT NULL" },
        { "column": "last_modified", "value": "INTEGER DEFAULT (strftime('%s', 'now'))" }
      ],
      "values": [
        [1, "Devdactic", "The main blog of Simon Grimm", 1587310030],
        [2, "Ionic Academy", "The online school to learn Ionic", 1590388125],
        [3, "Ionic Company", "Your favourite cross platform framework", 1590383895]
      ]
    },
    {
      "name": "products",
      "schema": [
        { "column": "id", "value": "INTEGER PRIMARY KEY NOT NULL" },
        { "column": "name", "value": "TEXT NOT NULL" },
        { "column": "currency", "value": "TEXT" },
        { "column": "value", "value": "INTEGER" },
        { "column": "vendorid", "value": "INTEGER" },
        { "column": "status", "value": "TEXT" },
        { "column": "rareness", "value": "TEXT" },
        { "column": "last_modified", "value": "INTEGER DEFAULT (strftime('%s', 'now'))" },
        {
          "foreignkey": "vendorid",
          "value": "REFERENCES vendors(id)"
        }
      ],
      "values": [
        [1, "Devdactic Fan Hat", "EUR", 9, 1, 'available', 'very rare', 1604396241],
        [2, "Ionic Academy Membership", "USD", 25, 2, 'available', 'very rare', 1604296241],
        [3, "Ionic Sticker Swag", "USD", 4, 3, 'available', 'very rare', 1594196241],
        [4, "Practical Ionic Book", "USD", 79, 1, 'available', 'very rare', 1603396241]
      ]
    }
  ]
};

export const productSchemaJson: string = JSON.stringify(productSchemaObject);