# How to reproduce

1. Install dependencies for client-app and manage-app
2. `yarn start:dev` in client-app and manager-app
3. Go to `http://localhost:3001/manager-service/swagger-ui/#/orders/get_run`
4. There's only one endpoint defined in swagger - run it and check the console. You'll see alternating messages:

---
`Calling Payment service...Successfully!` 
---

---
`Calling Payment service...There is no equivalent message pattern defined in the remote service. undefined`
---