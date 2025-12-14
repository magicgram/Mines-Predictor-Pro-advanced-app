
import React, { useState, useCallback, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface PostbackGuideProps {
  onBack: () => void;
}

const ArrowLeftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
);

const CopyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
    </svg>
);

const CheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
);

const CopyableUrl: React.FC<{ url: string }> = ({ url }) => {
    const { t } = useLanguage();
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(url).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }, [url]);

    return (
        <div className="mt-2 flex items-center justify-between bg-black/30 p-2 rounded-md border border-white/20">
            <code className="font-mono text-xs md:text-sm text-sky-300 break-all">{url}</code>
            <button onClick={handleCopy} className="p-1.5 text-gray-300 hover:text-white transition-colors flex-shrink-0" aria-label={t('copy')}>
                {copied ? <CheckIcon className="w-5 h-5 text-green-400" /> : <CopyIcon className="w-5 h-5" />}
            </button>
        </div>
    );
};

const PostbackUrlComponent: React.FC<{
  title: string;
  description: string;
  baseUrl: string;
  params: Array<{ key: string; value: string; desc: string }>;
}> = React.memo(({ title, description, baseUrl, params }) => {
  const url = `${baseUrl}?${params.map(p => `${p.key}=${p.value}`).join('&')}`;
  
  return (
    <div className="p-4 bg-black/20 rounded-lg border border-white/10">
        <h3 className="font-bold text-white text-lg">{title}</h3>
        <p className="text-sm text-white/80 mt-1 mb-3">{description}</p>
        <div className="space-y-2 text-sm text-white/80">
          {params.map(p => (
            <div key={p.key}>
              <p><code className="text-xs bg-sky-500/20 text-sky-300 p-1 rounded">{p.key}</code>: {p.desc}</p>
            </div>
          ))}
        </div>
        <CopyableUrl url={url} />
    </div>
  );
});

const PostbackGuide: React.FC<PostbackGuideProps> = ({ onBack }) => {
    const { t } = useLanguage();
    const [domain, setDomain] = useState('');

    useEffect(() => {
        setDomain(window.location.origin);
    }, []);
    
    return (
        <div className="w-full h-full flex flex-col text-white font-poppins">
            <header className="flex items-center mb-4 flex-shrink-0">
                <div className="w-10">
                    <button onClick={onBack} className="p-2 rounded-full text-gray-300 hover:bg-white/10" aria-label={t('goBack')}>
                        <ArrowLeftIcon className="w-6 h-6" />
                    </button>
                </div>
                <h1 className="text-lg md:text-xl font-russo text-white tracking-wide text-center flex-grow uppercase">{t('postbackGuideTitle')}</h1>
                <div className="w-10"></div>
            </header>
            
            <div className="flex-grow overflow-y-auto px-1 space-y-6">
                <p className="text-center text-white/80 text-sm" dangerouslySetInnerHTML={{ __html: t('postbackGuideDescription') }}/>
                
                {domain && (
                    <div className="p-2 text-center bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-xs text-yellow-300">
                        {t('postbackGuideImportant')}: <strong className="font-mono">{domain}</strong>
                    </div>
                )}
                
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <h2 className="font-bold text-lg text-blue-300">{t('postbackGuideStep1Title')}</h2>
                    <p className="text-sm text-white/80 mt-2">
                        {t('postbackGuideStep1Desc')}
                    </p>
                    <ul className="list-disc list-inside text-sm text-white/80 mt-2 space-y-1">
                        <li dangerouslySetInnerHTML={{ __html: t('postbackGuideStep1List1') }} />
                        <li dangerouslySetInnerHTML={{ __html: t('postbackGuideStep1List2') }} />
                    </ul>
                    <p className="text-sm text-white/80 mt-2">
                        {t('postbackGuideStep1Bottom')}
                    </p>
                </div>

                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <h2 className="font-bold text-lg text-green-300">{t('postbackGuideStep2Title')}</h2>
                   <p className="text-sm text-white/80 mt-2">
                        {t('postbackGuideStep2Desc')}
                    </p>
                </div>

                <div className="space-y-4">
                    <PostbackUrlComponent 
                      title={t('postbackGuideRegistrationTitle')}
                      description={t('postbackGuideRegistrationDesc')}
                      baseUrl={`${domain}/api/postback`}
                      params={[
                        { key: 'event_type', value: 'registration', desc: t('postbackGuideRegistrationParamDesc') },
                        { key: 'user_id', value: '{user_id}', desc: t('postbackGuideUserIdParamDesc') }
                      ]}
                    />

                    <PostbackUrlComponent 
                      title={t('postbackGuideFtdTitle')}
                      description={t('postbackGuideFtdDesc')}
                      baseUrl={`${domain}/api/postback`}
                      params={[
                        { key: 'event_type', value: 'first_deposit', desc: t('postbackGuideFtdParamDesc') },
                        { key: 'user_id', value: '{user_id}', desc: t('postbackGuideUserIdParamDesc') },
                        { key: 'amount', value: '{amount}', desc: t('postbackGuideAmountParamDesc') }
                      ]}
                    />

                     <PostbackUrlComponent 
                      title={t('postbackGuideDepTitle')}
                      description={t('postbackGuideDepDesc')}
                      baseUrl={`${domain}/api/postback`}
                      params={[
                        { key: 'event_type', value: 'recurring_deposit', desc: t('postbackGuideDepParamDesc') },
                        { key: 'user_id', value: '{user_id}', desc: t('postbackGuideUserIdParamDesc') },
                        { key: 'amount', value: '{amount}', desc: t('postbackGuideAmountParamDesc') }
                      ]}
                    />
                </div>
                
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <h2 className="font-bold text-lg text-red-300">{t('postbackGuideTroubleTitle')}</h2>
                    <p className="text-sm text-white/80 mt-2">
                        {t('postbackGuideTroubleDesc')}
                    </p>
                    <ol className="list-decimal list-inside text-sm text-white/80 mt-2 space-y-2">
                        <li dangerouslySetInnerHTML={{ __html: t('postbackGuideTroubleList1') }} />
                        <li dangerouslySetInnerHTML={{ __html: t('postbackGuideTroubleList2') }} />
                    </ol>
                </div>
            </div>
        </div>
    );
};

export default PostbackGuide;
