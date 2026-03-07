import { motion } from "framer-motion";
import { leagueStandings, KausiTitle } from "../data/leagueStandings";
import { Trophy } from "lucide-react";

export default function StandingsTable() {
    return (
        <div className="w-full">
            <div className="flex items-center gap-3 mb-6 justify-center">
                <Trophy className="text-orange-400" size={24} />
                <h3 className="text-xl font-bold text-white uppercase tracking-wider">{KausiTitle}</h3>
            </div>

            <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl">
                <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                        <tr className="bg-white/10 text-white/70 uppercase text-xs font-bold">
                            <th className="p-4 text-center w-12">#</th>
                            <th className="p-4">Joukkue</th>
                            <th className="p-4 text-center">O</th>
                            <th className="p-4 text-center">V</th>
                            <th className="p-4 text-center">T</th>
                            <th className="p-4 text-center">H</th>
                            <th className="p-4 text-center">M</th>
                            <th className="p-4 text-center">ME</th>
                            <th className="p-4 text-center font-bold text-orange-400">P</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {leagueStandings.map((team, idx) => (
                            <motion.tr
                                key={team.team}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className={`transition-colors hover:bg-white/5 ${team.isSekta
                                        ? "bg-orange-500/20 border-l-4 border-orange-500"
                                        : ""
                                    }`}
                            >
                                <td className="p-4 text-center font-mono text-white/60">{team.rank}</td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <span className={`font-bold ${team.isSekta ? "text-orange-400" : "text-white"}`}>
                                            {team.team}
                                        </span>
                                        {team.isSekta && (
                                            <span className="bg-orange-500 text-white text-[10px] px-1.5 py-0.5 rounded uppercase font-black">
                                                Me
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="p-4 text-center text-white/80">{team.gamesPlayed}</td>
                                <td className="p-4 text-center text-white/80">{team.wins}</td>
                                <td className="p-4 text-center text-white/80">{team.draws}</td>
                                <td className="p-4 text-center text-white/80">{team.losses}</td>
                                <td className="p-4 text-center font-mono text-xs text-white/60">{team.goals}</td>
                                <td className={`p-4 text-center font-mono text-xs ${team.goalDiff.startsWith('+') ? "text-green-400" : "text-red-400"
                                    }`}>
                                    {team.goalDiff}
                                </td>
                                <td className="p-4 text-center font-bold text-lg text-white">{team.points}</td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-4 text-right">
                <a
                    href="https://tulospalvelu.salibandy.fi/team/2814/info"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/40 hover:text-white/70 text-xs transition underline"
                >
                    Lähde: Salibandyn tulospalvelu
                </a>
            </div>
        </div>
    );
}
