import { DefaultSession, DefaultUser } from "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  /** Returned by `useSession`, `getSession`, and received as a prop on the `SessionProvider` React Context */
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
    } & DefaultSession["user"];
  }

  /** The user object returned in the OAuth providers' `profile` callback, or the second parameter of the `session` callback, when using a database. */
  interface User extends DefaultUser {
    id: string;
    email: string;
    name: string;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    id: string;
    email: string;
    name: string;
  }
}
