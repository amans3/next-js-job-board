import Link from "next/link";
import logo from "../../public/logo.png";
import Image from "next/image";
import { buttonVariants } from "../ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { auth} from "@/app/utils/auth";
import { UserDropdown } from "./UserDropdown";

export async function Navbar() {
  const session = await auth();

  return (
    <div className="flex items-center justify-between py-5">
      <Link href="/" className="flex items-center gap-2">
        <Image src={logo} alt="Logo Job Board" width={40} height={40} />
        <h1 className="text-2xl font-bold">
          Job<span className="text-primary">Board</span>
        </h1>
      </Link>

    {/* Desktop Navigation  */}
    <div className="hidden md:flex items-center gap-5">
       <ThemeToggle />
       <Link className={buttonVariants({ size: "lg" })} href="/post-job">Post Job</Link>
       {session?.user ? (
          <UserDropdown email={session.user.email!} name={session.user.name!} image={session.user.image!} />
       ) : (
        <Link href="/login" className={buttonVariants({ variant: "outline", size: "lg" })}>Login</Link>
       )}
    </div>


      {/* <div className="flex items-center gap-4">
        <ThemeToggle />
        {session?.user ? (
            <form action={ async () => {
                "use server"
                await signOut({ redirectTo: "/" })
            }}>
                <Button>Logout</Button>
            </form>
            ) :(
                <Link href="/login" className={buttonVariants({ variant: "outline", size: "lg" })}>Login</Link>
            )}
      </div> */}
    </div>
  );
}
