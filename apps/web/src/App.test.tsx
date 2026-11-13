import {render,screen} from "@testing-library/react";
import {describe,expect,it} from "vitest";
import App from "./App";
describe("Dramora authentication foundation",()=>{it("renders sign-in and explains missing Supabase configuration",()=>{render(<App/>);expect(screen.getByRole("heading",{name:/welcome back/i})).toBeInTheDocument();expect(screen.getByText(/authentication setup required/i)).toBeInTheDocument();expect(screen.getByRole("button",{name:/sign in/i})).toBeDisabled();});});