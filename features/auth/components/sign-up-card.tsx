import { Input } from '@/components/ui/input';
import { DottedSeparator } from '@/components/dotted-separator';
import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import  Link  from "next/link";

import { 
    Card, 
    CardContent,
    CardDescription, 
    CardHeader, 
    CardTitle } from '@/components/ui/card';

export const SignUpCard = () => {
    return (
        <Card className="w-full h-full md:w-[487px] border-none shadow-none">
            <CardHeader className="flex items-center justify-center text-center p-7">
                <CardTitle className="text-2xl">
                    Sign Up
                </CardTitle>
                <CardDescription className="text-sm">
                    By signing up, you agree to our { " " }
                    <Link href="/terms">
                    <span className="text-orange-700">Terms of Service</span>
                    </Link> and {""}
                    <Link href="/privacy">
                    <span className="text-blue-700">Policy</span></Link>   
                </CardDescription>
            </CardHeader>
            <div className="px-7">
                <DottedSeparator />
            </div>
            <CardContent className="p-7">
                <form className="space-y-4">
                <Input 
                required
                type="text"
                value={""}
                onChange={() => {}}
                placeholder="Enter full name"
                disabled={false}
                />
                <Input 
                required
                type="email"
                value={""}
                onChange={() => {}}
                placeholder="Enter email address"
                disabled={false}
                />
                <Input 
                required
                type="password"
                value={""}
                onChange={() => {}}
                placeholder="Enter password"
                disabled={false}
                min={8}
                max={256}
                />
                <Button disabled={false} size="lg" className="w-full">
                    Login 
                </Button>
                </form>
            </CardContent>
            <div className="px-7">
                <DottedSeparator />
            </div>
            <CardContent className="p-7 flex flex-col gap-y-4">
                <Button 
                 disabled={false}
                 variant="secondary"
                 size="lg"
                 className="w-full">
                    <FcGoogle className="mr-2 size-5" />
                    SignUp with Google
                </Button>
                <Button 
                 disabled={false}
                 variant="secondary"
                 size="lg"
                 className="w-full">
                    <FaGithub className="mr-2 size-5" />
                    SignUp with Github
                </Button>
            </CardContent>
        </Card>
    );
};