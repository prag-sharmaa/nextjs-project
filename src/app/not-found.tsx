import Link from "next/link";

export default function NotFound(){
    return (
        <div>
            <h2> Not Found</h2>
            <p> Could not find the requested resource</p>
            <p> This is our custom not found page</p>
            <Link href="/">Return home</Link>
        </div>
    )
}