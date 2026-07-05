import React from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';

const PageToolbar = ({ items = [], activeId, onChange, renderItem }) => (
  <div className="lims-page-toolbar">
    <ButtonGroup className="lims-page-toolbar-group">
      {items.map((item) => {
        const isActive = activeId === item.id;
        const button = (
          <Button
            key={item.id}
            type="button"
            variant="light"
            className={`lims-page-toolbar-btn${isActive ? ' active' : ''}${item.className ? ` ${item.className}` : ''}`}
            onClick={() => onChange(item.id)}
          >
            {item.badge != null && item.badge > 0 && (
              <span className={`lims-page-toolbar-badge${item.badgeHighlight ? ' badge-highlight' : ''}`}>
                {item.badge}
              </span>
            )}
            {item.label}
          </Button>
        );
        return renderItem ? renderItem(item, button) : button;
      })}
    </ButtonGroup>
  </div>
);

export default PageToolbar;
