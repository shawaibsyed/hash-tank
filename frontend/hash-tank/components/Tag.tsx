import Link from "next/link";
import React from "react";

interface TagProps {
  label: string;
  onClick?: () => void;
  isSelected?: boolean;
}

function Tag({ label, onClick, isSelected }: TagProps) {
  let hashLabel = label;
  if(label != 'All' && label != 'Following' && label != 'Explore'){
    hashLabel = '#' + hashLabel;
  }
  return (
    <Link href={{pathname: '/' , query: {tag:label}}}  style={{textDecoration:'none', color:'black'}}>
    <span
      style={{
        display: "inline-block",
        marginRight:'16px',
        padding: "6px 10px",
        backgroundColor: !isSelected?"rgb(245, 245, 245)":"#389FC2 ",
        boxShadow: "rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
        borderRadius: "4px",
        marginLeft: "8px",
        marginTop: "4px",
        fontSize: "20px",
        fontWeight: "bold",
        cursor: "pointer",
        whiteSpace: "nowrap",
        color: isSelected?"white":"#389FC2",
        
      }}
      onClick={onClick}
    >
      {hashLabel}
    </span>
    </Link>
  );
}


export default Tag