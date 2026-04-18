import { motion } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';

const faqs = [
  {
    question: 'How long does a typical repair take?',
    answer: 'Most repairs are completed within 30–60 minutes while you wait. Screen and battery replacements are usually done in 30–45 minutes. More complex repairs like water damage may take 24–48 hours for proper diagnosis and treatment.',
  },
  {
    question: 'What warranty do you offer?',
    answer: 'All repairs come with a 3–6 month warranty covering parts and labour. If you experience any issues related to the repair within this period, we\'ll fix it free of charge.',
  },
  {
    question: 'What is your No Fix, No Pay policy?',
    answer: 'If we cannot fix your device, you pay nothing. We only charge when the repair is successfully completed to your satisfaction. We\'ll always give you an upfront quote before starting any work.',
  },
  {
    question: 'Do you use genuine parts?',
    answer: 'We use high-quality premium replacement parts that meet or exceed OEM standards. All parts are thoroughly tested before installation and are backed by our warranty.',
  },
  {
    question: 'Do I need to book an appointment?',
    answer: 'Walk-ins are always welcome! No appointment needed. However, booking online takes 30 seconds and guarantees minimal wait time when you arrive.',
  },
  {
    question: 'Where are you located? Is there parking?',
    answer: 'We are at Shop 153 Anzac Hwy, Kurralta Park SA 5037. Free parking is available right at the store. Kmart is also just a 1-minute walk away — drop your phone with us and shop while we fix it!',
  },
  {
    question: 'Can I mail my device in for repair?',
    answer: 'Absolutely! Simply send your device via Australia Post to our Kurralta Park address. We\'ll repair it and ship it back to you anywhere in Australia. WhatsApp us first for instructions and a quote.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept cash, all major credit/debit cards (Visa, Mastercard, Amex), and PayID. Payment is due on collection of your repaired device.',
  },
  {
    question: 'Do you repair all phone brands?',
    answer: 'Yes! We repair iPhones, all Samsung Galaxy models, Google Pixel, Oppo, Huawei, and most other Android phones. We also repair iPads, tablets, laptops, MacBooks, and smart watches.',
  },
];

export const FAQ = () => {
  return (
    <section className="py-20 md:py-28 bg-[#F8F8F8]" data-testid="faq-section">
      <div className="max-w-4xl mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-overline mb-3">Got Questions?</p>
          <h2 className="text-h2 mb-4">Frequently Asked Questions</h2>
          <p className="text-body-large max-w-xl mx-auto">
            Everything you need to know about our repair service.
          </p>
        </motion.div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <AccordionItem
                value={`item-${i}`}
                className="bg-white border-2 border-transparent data-[state=open]:border-[#E31E24] rounded-2xl px-6 transition-all"
              >
                <AccordionTrigger className="text-left font-semibold text-[#111111] hover:text-[#E31E24] hover:no-underline py-5 text-sm lg:text-base">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-[#555555] text-sm leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;
