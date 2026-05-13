// =====================================================================
// PageShell, wraps every template page with banner + nav + footer.
// Owns banner-dismiss state. Templates pass their <main> content as
// children. activeId controls which nav link is highlighted.
// =====================================================================
function PageShell({ activeId, children, designVariant }) {
  const [bannerOpen, setBannerOpen] = React.useState(true);
  const variantClass = designVariant ? ('variant-' + designVariant) : '';
  return (
    <div className={'shell ' + variantClass}>
      <Banner visible={bannerOpen} onDismiss={() => setBannerOpen(false)} />
      <Nav activeId={activeId} />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
window.PageShell = PageShell;
