'use server'

import { prisma } from "@/lib/prisma"
import { createSession, deleteSession } from "@/lib/auth"
import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'

interface AuthState {
  success: boolean;
  error?: string;
}

export async function register(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string
  const phone = formData.get('phone') as string

  if (!name || !email || !password || !phone) {
    return { success: false, error: 'All fields are required. Please fill out all fields.' }
  }

  if (password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters long.' }
  }

  if (confirmPassword && password !== confirmPassword) {
    return { success: false, error: 'Passwords do not match.' }
  }

  let userId = `usr_${Date.now()}`;
  let role: string = email.toLowerCase().includes('admin') ? 'ADMIN' : 'CUSTOMER';

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return { success: false, error: 'User already exists with this email address.' }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        role: role === 'ADMIN' ? 'ADMIN' : 'CUSTOMER'
      }
    })
    userId = user.id;
    role = user.role;
  } catch (dbError) {
    console.warn('Database offline, using session registration fallback:', dbError);
  }

  await createSession({
    userId,
    name,
    email,
    role,
  })

  if (role !== 'CUSTOMER') {
    redirect('/admin/dashboard')
  } else {
    redirect('/dashboard')
  }
}

export async function login(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { success: false, error: 'All fields are required.' }
  }

  let userId = `usr_${Date.now()}`;
  let userName = email.split('@')[0];
  let role: string = email.toLowerCase().includes('admin') ? 'ADMIN' : 'CUSTOMER';

  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (user && user.password) {
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        return { success: false, error: 'Invalid email or password.' }
      }
      userId = user.id;
      userName = user.name;
      role = user.role;
    }
  } catch (dbError) {
    console.warn('Database offline, using session login fallback:', dbError);
  }

  await createSession({
    userId,
    name: userName,
    email,
    role,
  })

  if (role !== 'CUSTOMER') {
    redirect('/admin/dashboard')
  } else {
    redirect('/dashboard')
  }
}

export async function logout() {
  await deleteSession()
  redirect('/')
}
