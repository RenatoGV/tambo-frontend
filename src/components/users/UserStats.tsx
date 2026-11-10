import { DollarSign, Receipt, Users, Wallet } from "lucide-react";

interface UserStatsProps {
   totalUsers: number;
}

export default function UserStats({ totalUsers }: Readonly<UserStatsProps>) {
   const stats = [
      {
         title: "Usuarios registrados",
         value: totalUsers.toString(),
         description: "Usuarios en el sistema",
         icon: Users,
         available: true,
      },
      {
         title: "Ventas del período",
         value: "—",
         description: "Estadísticas próximamente",
         icon: Receipt,
         available: false,
      },
      {
         title: "Mayor facturación",
         value: "—",
         description: "Estadísticas próximamente",
         icon: DollarSign,
         available: false,
      },
      {
         title: "Ticket promedio",
         value: "—",
         description: "Estadísticas próximamente",
         icon: Wallet,
         available: false,
      },
   ];

   return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
         {
            stats.map((stat) => {
               const Icon = stat.icon;

               return (
                  <div key={stat.title} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                     <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                           {stat.title}
                        </p>

                        <div className="rounded-lg bg-slate-100 p-2 text-purple-600 dark:bg-slate-800 dark:text-purple-400">
                           <Icon size={20} />
                        </div>
                     </div>

                     <p className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
                        {stat.value}
                     </p>

                     <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {stat.description}
                     </p>
                  </div>
               )
            })
         }
      </div>
   )
}