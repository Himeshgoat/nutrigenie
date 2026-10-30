import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NutriGenie | Personalized Nutrition Planner",
  description:
    "NutriGenie calculates personalized nutrition targets and generates meal recommendations based on your goals, activity, dietary preferences, and restrictions.",
  applicationName: "NutriGenie",
  keywords: ["personalized nutrition", "meal planner", "nutrition tracking"],
  openGraph: {
    title: "NutriGenie | Personalized Nutrition Planner",
    description:
      "Build a meal plan around your calorie target, diet, activity level, and fitness goal.",
    type: "website",
    siteName: "NutriGenie"
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
