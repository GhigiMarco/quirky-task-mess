
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";

const AuthPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            toast({
              title: "Error logging in",
              description: error.message,
              variant: "destructive",
            });
        } else {
            navigate('/');
        }
        setLoading(false);
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.signUp({ 
            email, 
            password,
            options: {
                emailRedirectTo: window.location.origin,
            },
        });
        if (error) {
             toast({
              title: "Error signing up",
              description: error.message,
              variant: "destructive",
            });
        } else {
            toast({
              title: "Check your email!",
              description: "We've sent you a confirmation link.",
            });
        }
        setLoading(false);
    };

    return (
        <div className="bg-gradient-to-tr from-pink-300 via-purple-300 to-indigo-400 min-h-screen p-4 font-mono w-full flex items-center justify-center">
            <div className="max-w-md w-full p-8 space-y-8" style={{ border: '5px dotted hotpink', backgroundColor: 'rgba(0,0,0,0.2)'}}>
                <h1 style={{ fontSize: '2.5rem', color: '#FFFF00', textShadow: '3px 3px 0px #FF00FF', textAlign: 'center' }}>
                    GET IN!
                </h1>
                <form className="space-y-6" onSubmit={handleLogin}>
                    <div>
                        <Input
                            type="email"
                            placeholder="your.email@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-4 bg-gray-200 text-gray-800 rounded-lg focus:outline-none focus:ring-4 focus:ring-red-500"
                        />
                    </div>
                    <div>
                         <Input
                            type="password"
                            placeholder="yOuR_sEcReT_pAsSwOrD"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-4 bg-gray-200 text-gray-800 rounded-lg focus:outline-none focus:ring-4 focus:ring-red-500"
                        />
                    </div>
                    <div className="flex space-x-4">
                        <Button type="submit" disabled={loading} className="w-full bg-blue-800 text-yellow-300 p-4 rounded-lg hover:bg-pink-500 font-bold text-lg">
                            {loading ? 'WAIT...' : 'LOG IN'}
                        </Button>
                        <Button onClick={handleSignUp} disabled={loading} className="w-full bg-green-500 text-white p-4 rounded-lg hover:bg-yellow-400 font-bold text-lg">
                            {loading ? 'HOLD ON...' : 'SIGN UP'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AuthPage;
