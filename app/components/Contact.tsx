import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, MapPin, Phone, Send } from "lucide-react";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Tin nhắn đã được gửi!",
      description: "Cảm ơn bạn đã liên hệ. Tôi sẽ phản hồi sớm nhất có thể.",
    });

    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Liên hệ</h2>
          <p className="text-muted-foreground text-lg">
            Hãy gửi tin nhắn cho tôi. Tôi luôn sẵn sàng lắng nghe!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
            <Card className="shadow-card hover:shadow-card-hover hover:-translate-y-2 transition-all duration-300 border-2 hover:border-primary/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary animate-scale-in" />
                  Email
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground hover:text-primary transition-colors">contact@portfolio.com</p>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-card-hover hover:-translate-y-2 transition-all duration-300 border-2 hover:border-primary/30 animate-fade-in" style={{ animationDelay: "200ms" }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary animate-scale-in" style={{ animationDelay: "250ms" }} />
                  Điện thoại
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground hover:text-primary transition-colors">+84 123 456 789</p>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-card-hover hover:-translate-y-2 transition-all duration-300 border-2 hover:border-primary/30 animate-fade-in" style={{ animationDelay: "300ms" }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary animate-scale-in" style={{ animationDelay: "350ms" }} />
                  Địa chỉ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground hover:text-primary transition-colors">
                  Hà Nội, Việt Nam
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="lg:col-span-2 shadow-card-hover hover:shadow-lg transition-all duration-300 animate-fade-in border-2 hover:border-primary/30" style={{ animationDelay: "200ms" }}>
            <CardHeader>
              <CardTitle>Gửi tin nhắn</CardTitle>
              <CardDescription>
                Điền thông tin của bạn và tôi sẽ phản hồi sớm nhất có thể
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Họ tên *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Nguyễn Văn A"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Tiêu đề *</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="Chủ đề tin nhắn"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Tin nhắn *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Nội dung tin nhắn của bạn..."
                    rows={6}
                    className="resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-auto"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2" />
                      Đang gửi...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Gửi tin nhắn
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Contact;
