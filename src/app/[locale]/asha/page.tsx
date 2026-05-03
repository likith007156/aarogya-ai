"use client";

import { useEffect, useState } from "react";
import { Users, AlertTriangle, FileText, CheckSquare, Plus, BellRing } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

type Patient = {
  id: string;
  name: string;
  age: number;
  village: string;
  riskLevel: string;
  suspectedDisease: string;
  abhaId?: string;
};

export default function AshaDashboard() {
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    // In a real app, this would be an API call
    // Mock data for demo
    setPatients([
      { id: "1", name: 'Ramesh Kumar', age: 45, village: 'Bidadi', riskLevel: 'HIGH', suspectedDisease: 'TB', abhaId: '12-3456-7890-1234' },
      { id: "2", name: 'Sunita Devi', age: 32, village: 'Kumbalgodu', riskLevel: 'MEDIUM', suspectedDisease: 'Anemia' },
      { id: "3", name: 'Raju Bhai', age: 50, village: 'Nelmangala', riskLevel: 'LOW', suspectedDisease: 'None' },
      { id: "4", name: 'Lakshmi', age: 28, village: 'Hoskote', riskLevel: 'HIGH', suspectedDisease: 'TB' },
      { id: "5", name: 'Kiran', age: 60, village: 'Devanahalli', riskLevel: 'HIGH', suspectedDisease: 'Diabetes' },
    ]);
  }, []);

  const sendReminder = () => {
    alert("WhatsApp reminders sent to all high-risk patients!");
  };

  return (
    <div className="min-h-screen bg-transparent p-6 font-sans">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">ASHA Worker Dashboard</h1>
          <p className="text-slate-500">Welcome back, Priya Sharma (Bidadi PHC)</p>
        </div>
        <Button onClick={sendReminder} className="bg-green-600 hover:bg-green-700">
          <BellRing className="w-4 h-4 mr-2" />
          Send Reminders
        </Button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Patients Today</CardTitle>
            <Users className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">23</div>
          </CardContent>
        </Card>
        <Card className="glass-card border-red-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-red-600">High Risk</CardTitle>
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-700">4</div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Referrals</CardTitle>
            <FileText className="w-4 h-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">7</div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">ABHA Created</CardTitle>
            <CheckSquare className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">18</div>
          </CardContent>
        </Card>
      </div>

      <div className="glass-panel rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-white/40 flex justify-between items-center bg-white/30 backdrop-blur-sm">
          <h2 className="text-lg font-bold text-slate-800">Recent Screenings</h2>
          <Button variant="outline" size="sm" className="text-blue-700 border-blue-300 hover:bg-blue-50/50 bg-white/50 backdrop-blur-sm">
            <Plus className="w-4 h-4 mr-1" /> Add New
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table className="min-w-[700px]">
            <TableHeader className="bg-white/40 backdrop-blur-md">
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Village</TableHead>
              <TableHead>Risk Level</TableHead>
              <TableHead>Suspected</TableHead>
              <TableHead>ABHA ID</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.map((p) => (
              <TableRow key={p.id} className={p.riskLevel === 'HIGH' ? "bg-red-50/40 hover:bg-red-50/60 transition-colors" : "hover:bg-white/50 transition-colors"}>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell>{p.age}</TableCell>
                <TableCell>{p.village}</TableCell>
                <TableCell>
                  <Badge variant={p.riskLevel === 'HIGH' ? 'destructive' : p.riskLevel === 'MEDIUM' ? 'secondary' : 'outline'}
                    className={p.riskLevel === 'MEDIUM' ? "bg-orange-100 text-orange-800" : p.riskLevel === 'LOW' ? "text-green-700 border-green-200 bg-green-50" : ""}
                  >
                    {p.riskLevel}
                  </Badge>
                </TableCell>
                <TableCell>{p.suspectedDisease}</TableCell>
                <TableCell className="font-mono text-xs text-slate-500">{p.abhaId || "Not generated"}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="text-blue-600">View</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </div>
      </div>
    </div>
  );
}
