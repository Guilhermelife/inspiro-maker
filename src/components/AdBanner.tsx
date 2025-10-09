const AdBanner = () => {
  return (
    <div className="w-full border-t border-border backdrop-blur-sm bg-background/95 sticky bottom-0 z-10">
      <div className="max-w-screen-lg mx-auto flex items-center justify-center h-[60px] px-4">
        <div className="w-full max-w-[320px] h-[50px] rounded-lg bg-gradient-to-br from-secondary to-secondary/50 border border-border flex items-center justify-center">
          <p className="text-xs text-muted-foreground font-medium">
            Banner AdMob 320×50
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdBanner;
