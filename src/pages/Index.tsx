import DealsBanner from "@/components/DealsBanner";
import IntentPrompt from "@/components/IntentPrompt";
import FeaturedProducts from "@/components/FeaturedProducts";
import CommunityPick from "@/components/CommunityPick";
import CreativePathsPreview from "@/components/CreativePathsPreview";
import PersonalisedDeals from "@/components/PersonalisedDeals";

const Index = () => (
  <div>
    <DealsBanner />
    <PersonalisedDeals />
    <IntentPrompt />
    <FeaturedProducts />
    <CommunityPick />
    <CreativePathsPreview />
  </div>
);

export default Index;
