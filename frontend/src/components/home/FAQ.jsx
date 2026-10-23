import { motion } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { homeFaqs as faqs } from '../../data/faqs';


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
                <AccordionContent forceMount className="text-[#555555] text-sm leading-relaxed pb-5">
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
