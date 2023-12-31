import connectToDB from "../../../utils/conn";
import User from '../../../models/User'
import { NextResponse } from "next/server";
import { compare, hash } from "bcryptjs";

export const dynamic = "force-dynamic";

export async function POST(req) {
    try {
        await connectToDB();
        const { username, password } = await req.json();

        const checkUser = await User.findOne({ username });

        if (!checkUser) {
            return NextResponse.json({
                success: false,
                message: "Username is not present",
            });
        }

        const hashPassword = await hash(checkUser.password, 12);
        const checkPassword = await compare(password, hashPassword)

        if (!checkPassword) {
            return NextResponse.json({
                success: false,
                message: "Wrong password",
            });
        }
        return NextResponse.json({
            success: true,
            message: "Login successful",
        });
    } catch (e) {
        console.log(e);

        return NextResponse.json({
            success: false,
            message: "Something goes wrong !Please try again",
        });
    }
}
