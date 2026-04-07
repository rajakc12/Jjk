import React, { useState } from 'react';
import { BookOpen, CheckCircle2, FileText, Languages, Star, ArrowRight, X, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const SYLLABUS_DATA: Record<string, Record<string, string[]>> = {
  UPSC: {
    'General Studies I': [
      'Current events of national and international importance.',
      'History of India and Indian National Movement.',
      'Indian and World Geography-Physical, Social, Economic Geography of India and the World.',
      'Indian Polity and Governance-Constitution, Political System, Panchayati Raj, Public Policy, Rights Issues, etc.',
      'Economic and Social Development-Sustainable Development, Poverty, Inclusion, Demographics, Social Sector Initiatives, etc.',
      'General issues on Environmental ecology, Bio-diversity and Climate Change - that do not require subject specialization.',
      'General Science.'
    ],
    'CSAT': [
      'Comprehension',
      'Interpersonal skills including communication skills',
      'Logical reasoning and analytical ability',
      'Decision making and problem solving',
      'General mental ability',
      'Basic numeracy (numbers and their relations, orders of magnitude, etc.) (Class X level)',
      'Data interpretation (charts, graphs, tables, data sufficiency etc. — Class X level)'
    ],
    'Current Affairs': [
      'Daily News Analysis (The Hindu/Indian Express)',
      'Monthly Magazines (Yojana, Kurukshetra)',
      'Government Schemes & Policies',
      'International Summits & Reports',
      'Science & Tech Developments'
    ],
    'Environment': [
      'Ecology & Ecosystems',
      'Biodiversity & Conservation',
      'Climate Change & Global Warming',
      'Environmental Laws & Organizations',
      'Pollution & Waste Management'
    ],
    'Economy': [
      'National Income Accounting',
      'Banking & Monetary Policy',
      'Fiscal Policy & Budgeting',
      'International Trade & Organizations',
      'Agriculture & Industrial Sector'
    ],
    'Essay': [
      'Candidates may be required to write essays on multiple topics.',
      'They will be expected to keep close to the subject of the essay to arrange their ideas in orderly fashion, and to write concisely.',
      'Credit will be given for effective and exact expression.'
    ],
    'GS I (History & Geography)': [
      'Indian Culture - Salient aspects of Art Forms, Literature and Architecture from ancient to modern times.',
      'Modern Indian History from about the middle of the eighteenth century until the present- significant events, personalities, issues.',
      'The Freedom Struggle — its various stages and important contributors/contributions from different parts of the country.',
      'Post-independence consolidation and reorganization within the country.',
      'History of the World will include events from 18th century such as industrial revolution, world wars, redrawal of national boundaries, colonization, decolonization, political philosophies like communism, capitalism, socialism etc.— their forms and effect on the society.',
      'Salient features of Indian Society, Diversity of India.',
      'Role of women and women’s organization, population and associated issues, poverty and developmental issues, urbanization, their problems and their remedies.',
      'Effects of globalization on Indian society.',
      'Social empowerment, communalism, regionalism & secularism.',
      'Salient features of world’s physical geography.',
      'Distribution of key natural resources across the world (including South Asia and the Indian sub-continent); factors responsible for the location of primary, secondary, and tertiary sector industries in various parts of the world (including India).',
      'Important Geophysical phenomena such as earthquakes, Tsunami, Volcanic activity, cyclone etc., geographical features and their location-changes in critical geographical features (including water-bodies and ice-caps) and in flora and fauna and the effects of such changes.'
    ],
    'GS II (Polity & Governance)': [
      'Indian Constitution—historical underpinnings, evolution, features, amendments, significant provisions and basic structure.',
      'Functions and responsibilities of the Union and the States, issues and challenges pertaining to the federal structure, devolution of powers and finances up to local levels and challenges therein.',
      'Separation of powers between various organs dispute redressal mechanisms and institutions.',
      'Comparison of the Indian constitutional scheme with that of other countries.',
      'Parliament and State legislatures—structure, functioning, conduct of business, powers & privileges and issues arising out of these.',
      'Structure, organization and functioning of the Executive and the Judiciary—Ministries and Departments of the Government; pressure groups and formal/informal associations and their role in the Polity.',
      'Salient features of the Representation of People’s Act.',
      'Appointment to various Constitutional posts, powers, functions and responsibilities of various Constitutional Bodies.',
      'Statutory, regulatory and various quasi-judicial bodies.',
      'Government policies and interventions for development in various sectors and issues arising out of their design and implementation.',
      'Development processes and the development industry —the role of NGOs, SHGs, various groups and associations, donors, charities, institutional and other stakeholders.',
      'Welfare schemes for vulnerable sections of the population by the Centre and States and the performance of these schemes; mechanisms, laws, institutions and Bodies constituted for the protection and betterment of these vulnerable sections.',
      'Issues relating to development and management of Social Sector/Services relating to Health, Education, Human Resources.',
      'Issues relating to poverty and hunger.',
      'Important aspects of governance, transparency and accountability, e-governance- applications, models, successes, limitations, and potential; citizens charters, transparency & accountability and institutional and other measures.',
      'Role of civil services in a democracy.',
      'India and its neighborhood- relations.',
      'Bilateral, regional and global groupings and agreements involving India and/or affecting India’s interests.',
      'Effect of policies and politics of developed and developing countries on India’s interests, Indian diaspora.',
      'Important International institutions, agencies and fora- their structure, mandate.'
    ],
    'GS III (Economy & Tech)': [
      'Indian Economy and issues relating to planning, mobilization, of resources, growth, development and employment.',
      'Inclusive growth and issues arising from it.',
      'Government Budgeting.',
      'Major crops-cropping patterns in various parts of the country, - different types of irrigation and irrigation systems storage, transport and marketing of agricultural produce and issues and related constraints; e-technology in the aid of farmers.',
      'Issues related to direct and indirect farm subsidies and minimum support prices; Public Distribution System- objectives, functioning, limitations, revamping; issues of buffer stocks and food security; Technology missions; economics of animal-rearing.',
      'Food processing and related industries in India- scope’ and significance, location, upstream and downstream requirements, supply chain management.',
      'Land reforms in India.',
      'Effects of liberalization on the economy, changes in industrial policy and their effects on industrial growth.',
      'Infrastructure: Energy, Ports, Roads, Airports, Railways etc.',
      'Investment models.',
      'Science and Technology- developments and their applications and effects in everyday life.',
      'Achievements of Indians in science & technology; indigenization of technology and developing new technology.',
      'Awareness in the fields of IT, Space, Computers, robotics, nano-technology, bio-technology and issues relating to intellectual property rights.',
      'Conservation, environmental pollution and degradation, environmental impact assessment.',
      'Disaster and disaster management.',
      'Linkages between development and spread of extremism.',
      'Role of external state and non-state actors in creating challenges to internal security.',
      'Challenges to internal security through communication networks, role of media and social networking sites in internal security challenges, basics of cyber security; money-laundering and its prevention.',
      'Security challenges and their management in border areas - linkages of organized crime with terrorism.',
      'Various Security forces and agencies and their mandate.'
    ],
    'GS IV (Ethics)': [
      'Ethics and Human Interface: Essence, determinants and consequences of Ethics in human actions; dimensions of ethics; ethics in private and public relationships. Human Values – lessons from the lives and teachings of great leaders, reformers and administrators; role of family, society and educational institutions in inculcating values.',
      'Attitude: content, structure, function; its influence and relation with thought and behaviour; moral and political attitudes; social influence and persuasion.',
      'Aptitude and foundational values for Civil Service , integrity, impartiality and non-partisanship, objectivity, dedication to public service, empathy, tolerance and compassion towards the weaker-sections.',
      'Emotional intelligence-concepts, and their utilities and application in administration and governance.',
      'Contributions of moral thinkers and philosophers from India and world.',
      'Public/Civil service values and Ethics in Public administration: Status and problems; ethical concerns and dilemmas in government and private institutions; laws, rules, regulations and conscience as sources of ethical guidance; accountability and ethical governance; strengthening of ethical and moral values in governance; ethical issues in international relations and funding; corporate governance.',
      'Probity in Governance: Concept of public service; Philosophical basis of governance and probity; Information sharing and transparency in government, Right to Information, Codes of Ethics, Codes of Conduct, Citizen’s Charters, Work culture, Quality of service delivery, Utilization of public funds, challenges of corruption.',
      'Case Studies on above issues.'
    ]
  },
  PSC: {
    'General Studies': [
      'History of India and Indian National Movement.',
      'Physical, Social and Economic Geography of India.',
      'Constitution of India and Polity.',
      'Indian Economy.',
      'General Science and Technology.',
      'Current Affairs (National and International).',
      'General Mental Ability.'
    ]
  }
};

export const ExamSection = ({ type }: { type: 'UPSC' | 'PSC' }) => {
  const [stage, setStage] = useState<'Pre' | 'Mains'>('Pre');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  const subjects = stage === 'Pre' 
    ? (type === 'UPSC' ? ['General Studies I', 'CSAT', 'Current Affairs', 'Environment', 'Economy'] : ['General Studies', 'CSAT', 'State Specific GK'])
    : (type === 'UPSC' 
        ? ['Essay', 'GS I (History & Geography)', 'GS II (Polity & Governance)', 'GS III (Economy & Tech)', 'GS IV (Ethics)', 'Optional Paper I', 'Optional Paper II']
        : ['General Studies I', 'General Studies II', 'General Studies III', 'General Studies IV', 'State Specific GS', 'Optional Paper']);

  const getSyllabus = (sub: string) => {
    return SYLLABUS_DATA[type]?.[sub] || SYLLABUS_DATA[type]?.['General Studies'] || ['Syllabus details coming soon...'];
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-bold font-serif mb-2">{type} Preparation</h2>
          <p className="text-stone-500">Structured resources and detailed syllabus for {type} aspirants.</p>
        </div>
        <div className="flex bg-stone-100 p-1 rounded-full">
          {['Pre', 'Mains'].map((s) => (
            <button
              key={s}
              onClick={() => setStage(s as any)}
              className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all ${
                stage === s ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-2xl font-bold font-serif">{stage} Subjects</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subjects.map((sub, i) => (
              <motion.div 
                key={i}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedSubject(sub)}
                className="glass-card p-6 flex items-center justify-between group cursor-pointer border-transparent hover:border-amber-200"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-stone-100 rounded-xl flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                    <BookOpen size={18} className="text-stone-500 group-hover:text-amber-600" />
                  </div>
                  <div>
                    <span className="font-bold text-stone-800 block">{sub}</span>
                    <span className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">Click for Syllabus</span>
                  </div>
                </div>
                <ArrowRight size={18} className="text-stone-300 group-hover:text-amber-500 transition-all" />
              </motion.div>
            ))}
          </div>

          {stage === 'Mains' && (
            <div className="glass-card p-10 bg-stone-900 text-stone-100">
              <div className="flex items-center gap-3 mb-6">
                <FileText className="text-amber-500" />
                <h3 className="text-2xl font-bold font-serif">Mains Answer Evaluation</h3>
              </div>
              <p className="text-stone-400 text-sm mb-8 leading-relaxed">
                Get your answers evaluated by AI based on UPSC/PSC standards. Support for both Hindi and English.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[10, 15, 20, 25].map(mark => (
                  <div key={mark} className="bg-stone-800 border border-stone-700 p-4 rounded-2xl text-center">
                    <div className="text-2xl font-bold text-amber-500">{mark}</div>
                    <div className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">Marks Q</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                <button className="flex items-center gap-2 px-6 py-3 bg-white text-stone-900 rounded-xl text-sm font-bold hover:bg-stone-100 transition-colors">
                  <Languages size={18} /> Start Hindi Evaluation
                </button>
                <button className="flex items-center gap-2 px-6 py-3 bg-amber-500 text-stone-900 rounded-xl text-sm font-bold hover:bg-amber-400 transition-colors">
                  <Languages size={18} /> Start English Evaluation
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="glass-card p-8">
            <h4 className="font-bold font-serif mb-6">Preparation Checklist</h4>
            <div className="space-y-4">
              {[
                'Syllabus Analysis',
                'NCERT Basics',
                'Standard Reference Books',
                'Daily News Reading',
                'Answer Writing Practice',
                'Mock Test Series'
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-stone-600">
                  <CheckCircle2 size={18} className={i < 3 ? 'text-green-500' : 'text-stone-300'} />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-8 bg-amber-50 border-amber-100">
            <Star className="text-amber-500 mb-4" fill="currentColor" />
            <h4 className="font-bold mb-2">Expert Strategy</h4>
            <p className="text-xs text-stone-600 leading-relaxed italic">
              "Consistency is more important than intensity. Studying 6 hours daily for a year is better than studying 16 hours for a month."
            </p>
          </div>
        </div>
      </div>

      {/* Syllabus Modal */}
      <AnimatePresence>
        {selectedSubject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-stone-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-3xl max-h-[80vh] rounded-[32px] overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="p-8 border-b border-stone-100 flex items-center justify-between bg-stone-50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center">
                    <BookOpen className="text-amber-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold font-serif text-stone-900">{selectedSubject}</h3>
                    <p className="text-xs text-stone-500 uppercase tracking-widest font-bold">{type} {stage} Syllabus</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedSubject(null)}
                  className="p-2 hover:bg-stone-200 rounded-full transition-colors"
                >
                  <X size={24} className="text-stone-400" />
                </button>
              </div>
              
              <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                    <Info className="text-blue-500 shrink-0 mt-1" size={20} />
                    <p className="text-sm text-blue-700 leading-relaxed">
                      This is the official syllabus as per the latest notifications. Focus on these key areas for comprehensive preparation.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    {getSyllabus(selectedSubject).map((point, idx) => (
                      <div key={idx} className="flex gap-4 group">
                        <span className="w-6 h-6 bg-stone-100 rounded-full flex items-center justify-center text-[10px] font-bold text-stone-400 shrink-0 group-hover:bg-amber-100 group-hover:text-amber-600 transition-colors">
                          {idx + 1}
                        </span>
                        <p className="text-stone-700 text-sm leading-relaxed pt-0.5">
                          {point}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="p-8 border-t border-stone-100 bg-stone-50 flex justify-end">
                <button 
                  onClick={() => setSelectedSubject(null)}
                  className="px-8 py-3 bg-stone-900 text-white rounded-xl font-bold text-sm hover:bg-stone-800 transition-colors"
                >
                  Close Syllabus
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
