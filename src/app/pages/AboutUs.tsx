import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { UserNavbar } from '../components/UserNavbar';
import { Card, CardBody, CardHeader } from '../components/Card';
import { Users, Mail, Phone, Building } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { getApiUrl, getAssetUrl } from '../utils/apiConfig';

interface OrgMember {
  id: number;
  name: string;
  position: string;
  department: string;
  email?: string;
  phone?: string;
  photo?: string;
  level: number;
}

export function AboutUs() {
  const { t } = useTranslation();
  const [orgMembers, setOrgMembers] = useState<OrgMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrgMembers();
  }, []);

  const fetchOrgMembers = async () => {
    try {
      setLoading(true);
      const response = await fetch(getApiUrl('/api/org-members'));
      if (!response.ok) throw new Error('Failed to load org members');
      const data = await response.json();
      setOrgMembers(data.sort((a: OrgMember, b: OrgMember) => a.level - b.level));
    } catch (error) {
      console.error('Error fetching org members:', error);
      toast.error('Failed to load organization members');
    } finally {
      setLoading(false);
    }
  };

  const getMembersByLevel = (level: number) => {
    return orgMembers.filter(m => m.level === level);
  };

  const getLevelLabel = (level: number) => {
    const labels: { [key: number]: string } = {
      1: 'Leadership',
      2: 'Council',
      3: 'Staff & Volunteers',
      4: 'Support Team',
    };
    return labels[level] || `Level ${level}`;
  };

  const getLevelColor = (level: number) => {
    const colors: { [key: number]: string } = {
      1: 'bg-red-100 dark:bg-red-900/30 border-red-300',
      2: 'bg-blue-100 dark:bg-blue-900/30 border-blue-300',
      3: 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300',
      4: 'bg-green-100 dark:bg-green-900/30 border-green-300',
    };
    return colors[level] || 'bg-gray-100 dark:bg-gray-800 border-gray-300';
  };

  const getLevelAccentColor = (level: number) => {
    const colors: { [key: number]: string } = {
      1: 'from-red-500 to-red-400',
      2: 'from-blue-500 to-blue-400',
      3: 'from-yellow-500 to-yellow-400',
      4: 'from-green-500 to-green-400',
    };
    return colors[level] || 'from-gray-500 to-gray-400';
  };

  const maxLevel = Math.max(...orgMembers.map(m => m.level), 1);
  const levels = Array.from({ length: maxLevel }, (_, i) => i + 1);

  return (
    <>
      <UserNavbar />
      <div className="min-h-screen pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center mb-4">
              <Building className="w-10 h-10 text-red-600 dark:text-red-500" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {t('About Us')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Sacred Heart Parish Organization Structure
            </p>
          </motion.div>

          {/* Organization Description */}
          <Card className="mb-12">
            <CardBody className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Our History
              </h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                <p>
                  The Sacred Heart of Jesus Parish Mandaluyong had its humble beginning as a chapel built inside the Welfareville Compound of Mandaluyong. Rev. Fr. Isidro L. Jose was assigned on February 2, 1947 as chaplain to look after the spiritual welfare of the inmates at Welfareville. After four years, he thought that it was time to get his people a proper place of worship. So he lost no time in seeking permission from his superior to have a chapel built in Welfareville. Permission was granted and on October 7, 1951, the cornerstone of the chapel whose patron is the Sacred Heart of Jesus was laid by the Most. Reverend Gabriel Reyes, D. D., Archbishop of Manila.
                </p>
                <p>
                  A Catholic Association of Welfareville was formed under the leadership of Mrs. Luisa Vergara to raise the initial funds for the project. However, to build a chapel inside Welfareville, Fr. Jose had to secure permission from the Secretary of Health and Public Welfare. But an opinion of the Secretary of Justice said it could be done only if the title of the projected chapel was to be vested in by the Government. This did not meet with Fr. Jose's plans so the fund drive was stopped.
                </p>
                <p>
                  Later, Fr. Jose learned of another legal opinion that a chapel could be built on government property provided it paid rental to the Government. Determined to have his chapel, he organized a new fund drive called Catholic Action of Welfareville under the leadership of Delia P. Medina. With the help of hundreds of generous dedicated souls, Fr. Jose was able to have a chapel constructed, with a grotto of the Our Lady of Lourdes behind it.
                </p>
                <p>
                  The Most Reverend Rufino Santos, D. D. blessed the chapel on November 27, 1954. The image of the Sacred Heart which was brought by the Benedictine Sisters to the Welfareville grounds in 1943 and first installed in one of the rooms of the building for the children's nursery and Home for the Aged, was then enshrined at the main altar of the completed chapel.
                </p>
                <p>
                  With the completion of the chapel, however, the ownership still remained unsettled. The case dragged on for years, until on March 26, 1966, Judge Cecilia Muñoz Palma ruled that the ownership, administration and operation of Welfareville chapel belonged to the Catholic Church of the Philippines, citing in effect that it was the House of God.
                </p>
                <p>
                  Fr. Jose remained as chaplain until his transfer in 1961. He was succeed by Fr. Luciano Paguiligan who stayed until 1962. From 1962 to 1971, Fr. Dalmacio Eusebio, Jr. and Fr. Alfredo Sta. Ana followed each other as chaplain. In 1971, Fr. Juventino Romano assumed chaplaincy and initiated a move to convert Sacred Heart of Jesus from chaplaincy to a Parish. Unfortunately, he left for Papua New Guinea in 1978 before his project was realized.
                </p>
                <p>
                  Fr. Jaime Mora took over the chaplaincy on October 15, 1978. He engineered further improvements in the chapel and revived the Chaplaincy Council. He raised funds for a new rectory and pursued the conversation of the chapel to a parish. On November 15, 1979, coinciding with the 25th anniversary of the Chaplaincy, His Eminence Jaime Cardinal Sin blessed the new rectory. During his celebration of the Mass, His Eminence announced that he was making the Sacred Heart Chaplaincy a Parish.
                </p>
                <p>
                  The decree of erection was issued on November 29, 1979. The inauguration of the Parish and the formal installation of Fr. Jaime J. Mora as parish priest were held on December 19, 1979. Thus the long cherished dream became a reality. Fr. Mora stayed as Parish Priest until 1983 when he moved to his next assignment.
                </p>
                <p>
                  Fr. Amando Ligon, a young and energetic priest from Bulacan served as parish priest from 1983 to 1991. Fr. Lorenzo J. Egos succeeded Fr. Ligon and served until 2006. Fr. Egos instituted the Perpetual Adoration Chapel in 1992 to give the parishioners a more private and solemn place for worship. He also initiated major physical improvements such as the renovation of the main altar.
                </p>
                <p>
                  On December 20, 1997, another momentous event was added to the history of the Sacred Heart of Jesus Parish – the inauguration of the Immaculate Heart of Mary Parish Center (so named by His Eminence Cardinal Sin). The Parish Center took only eight months to complete. Today, it is a popular and ideal venue for seminars, conferences, meetings and social gatherings.
                </p>
                <p>
                  The Sacred Heart of Jesus Parish has humbly taken the honor of being the site of the conferment rites of Papal Award (Pro Ecclesia et Pontifice) to six of its parishioners: Cory Duran, November 9, 1989; Jose Atienza, February 4, 1990; Norma Lim, March 4, 1993; Nena Orendain, Rosie Ramirez and Romer Montoya, September 20, 1999.
                </p>
                <p>
                  Fourteen mandated organization under the umbrella of the Parish Pastoral Council work together towards the attainment of the VISION-MISSION of the parish which is aimed towards the implementation of the goals of PCP II, and PCM II, namely: to be a church of the poor; a community of disciples; and renewed lay evangelization.
                </p>
                <p>
                  In 2006, when Fr. Wilmer Rosario became the parish priest, the PPC again revived a plan that had long been set aside. Renovation and expansion had been the plans of the previous parish priests, however, it was never realized. The opportunity to start the plan came and in 2007 renovation started. With the help of the different organizations and the parishioners, the plan came to fruition in 2009 when the church was finally finished.
                </p>
                <p>
                  Thus, in November 29, 2009, the newly rebuilt Sacred Heart of Jesus Parish was consecrated in a lavish celebration and mass led by the then Archbishop of Manila, Gaudencio B. Cardinal Rosales, D.D.
                </p>
                <p>
                  Through the untiring efforts of the chaplains and parish priests, the parish has achieved great improvements, despite the fact that it is considered as one of the poorest parishes in the Archdiocese of Manila. It now serves both material and spiritual needs of 80,000 parishioners, half of whom belong to the marginal portion of society.
                </p>
                <p>
                  Truly its history has gone a long way and hope that it will continue to make greater progress with God at its helm.
                </p>
              </div>
            </CardBody>
          </Card>

          {/* Org Chart Hierarchy */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin">
                <div className="w-8 h-8 border-4 border-gray-300 border-t-red-600 rounded-full"></div>
              </div>
              <p className="text-gray-500 dark:text-gray-400 mt-4">{t('Loading')}...</p>
            </div>
          ) : orgMembers.length === 0 ? (
            <Card className="text-center py-12">
              <CardBody>
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">{t('No organization members found')}</p>
              </CardBody>
            </Card>
          ) : (
            <div className="space-y-14">
              {levels.map(level => {
                const levelMembers = getMembersByLevel(level);
                if (levelMembers.length === 0) return null;

                return (
                  <motion.div
                    key={`level-${level}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (level - 1) * 0.2 }}
                    className="space-y-6"
                  >
                    {/* Level Header with accent bar */}
                    <div className="flex items-center gap-4 mb-8">
                      <div className={`h-1 flex-1 bg-gradient-to-r ${getLevelAccentColor(level)}`} />
                      <h2 className="text-2xl font-bold text-gray-800 dark:text-white px-4 whitespace-nowrap">
                        {getLevelLabel(level)}
                      </h2>
                      <div className={`h-1 flex-1 bg-gradient-to-l ${getLevelAccentColor(level)}`} />
                    </div>

                    {/* Members Grid */}
                    <div className={`${level === 1 ? 'flex flex-wrap justify-center gap-8' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'}`}>
                      {levelMembers.map((member, idx) => (
                        <motion.div
                          key={`member-${member.id}`}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: (level - 1) * 0.2 + idx * 0.1 }}
                          layout
                          className={level === 1 ? 'w-80' : ''}
                        >
                          <Card className={`overflow-hidden border-2 ${getLevelColor(level)} h-full hover:shadow-xl transition-all duration-300 transform hover:scale-105`}>
                            {/* Photo Section */}
                            <div className="relative w-full h-56 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                              {member.photo ? (
                                <img
                                  src={getAssetUrl(member.photo || '')}
                                  alt={member.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200?text=No+Photo';
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-300 dark:bg-gray-600">
                                  <Users className="w-16 h-16 text-gray-500" />
                                </div>
                              )}
                              {/* Level badge */}
                              <div className={`absolute top-2 right-2 px-3 py-1 rounded-full text-white text-xs font-bold bg-gradient-to-r ${getLevelAccentColor(level)}`}>
                                Level {level}
                              </div>
                            </div>

                            {/* Member Info */}
                            <CardBody className="p-5">
                              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 line-clamp-2">
                                {member.name}
                              </h3>
                              <p className="text-sm font-semibold text-red-600 dark:text-red-400 mb-1 line-clamp-2">
                                {member.position}
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
                                {member.department}
                              </p>

                              {/* Contact Information */}
                              <div className="border-t border-gray-200 dark:border-gray-600 pt-3 space-y-2">
                                {member.email && (
                                  <a
                                    href={`mailto:${member.email}`}
                                    className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline group"
                                  >
                                    <Mail className="w-4 h-4 flex-shrink-0 group-hover:scale-110 transition-transform" />
                                    <span className="truncate">{member.email}</span>
                                  </a>
                                )}
                                {member.phone && (
                                  <a
                                    href={`tel:${member.phone}`}
                                    className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline group"
                                  >
                                    <Phone className="w-4 h-4 flex-shrink-0 group-hover:scale-110 transition-transform" />
                                    <span>{member.phone}</span>
                                  </a>
                                )}
                              </div>
                            </CardBody>
                          </Card>
                        </motion.div>
                      ))}
                    </div>

                    {/* Divider line between levels */}
                    {level < maxLevel && (
                      <div className="flex justify-center pt-8">
                        <div className="w-1 h-8 bg-gradient-to-b from-gray-300 to-gray-200 dark:from-gray-600 dark:to-gray-700"></div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}


        </div>
      </div>
    </>
  );
}
