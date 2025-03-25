'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

import axiosInstance from '@/lib/axiosInstance';
import { ToasterProvider } from '@/components/Toaster';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState<'admin' | 'employee'>('employee');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axiosInstance.post('https://learningmanagementsystemhw-azc0a4fmgre6cabn.westus3-01.azurewebsites.net/api/Employee/Login', {
        email,
        password,
        userType, // If backend needs this
      });
      const { token, employee, isSuccess } = response.data;
      if (isSuccess) {
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('user', JSON.stringify(employee));
        document.cookie = `role=${employee.role}; path=/; max-age=86400;`;
        if (userType === "admin") {
          if (employee.role?.includes('Admin')) {
            router.push('/l&d');
          }
          else {
            toast.error('Invalid credentials');
          }
        } else {
          router.push('/employee');
          toast.success("Login successful!");
        }
      } else {
        toast.error('Login failed!');
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToasterProvider>
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#f9fafb] to-[#e5e7eb] px-4">
        <Card className="w-full max-w-md bg-white/80 backdrop-blur-md shadow-xl rounded-3xl border border-gray-200 transition-all duration-300 hover:shadow-2xl">
          <CardHeader className="flex flex-col items-center space-y-5 py-6">
            <h1 className='text-3xl font-bold'>
              <span className='text-[#0e4b8d]'>Win</span>
              <span className='text-[#d04627]'>Learn</span>
            </h1>
            <div className="text-center space-y-1">
              <CardDescription className="text-gray-500">
                Log in to access your portal
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 px-6 py-4">
            <Tabs
              value={userType}
              onValueChange={(value) => setUserType(value as 'admin' | 'employee')}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 gap-2 bg-muted p-1 rounded-md border">
                <TabsTrigger
                  value="employee"
                  className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-md transition-colors"
                >
                  Employee
                </TabsTrigger>
                <TabsTrigger
                  value="admin"
                  className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-md transition-colors"
                >
                  Admin
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-600 text-sm">
                    {userType === 'admin' ? 'Admin Email' : 'Work Email'}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={userType === 'admin' ? 'admin@company.com' : 'you@company.com'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 text-base focus:ring-2 focus:ring-primary focus:outline-none transition"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-600 text-sm">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 text-base focus:ring-2 focus:ring-primary focus:outline-none transition"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-primary hover:bg-primary/90 text-base font-semibold rounded-lg transition-all duration-300"
                disabled={loading}
              >
                {loading ? (
                  <span className="animate-pulse">Authenticating...</span>
                ) : (
                  <>
                    Sign In as {userType === 'admin' ? 'Admin' : 'Employee'}
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </ToasterProvider>
  );
}
